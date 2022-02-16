import re
import hashlib
from urllib.parse import urlparse
from datetime import date, timedelta

import langdetect
from w3lib.html import remove_tags

from juniorguru.lib.md import md
from juniorguru.lib.timer import measure
from juniorguru.lib import google_sheets
from juniorguru.lib.coerce import (coerce, parse_boolean, parse_datetime, parse_text,
    parse_date, parse_set, parse_boolean_words, parse_url)
from juniorguru.models import PostedJob, db
from juniorguru.lib import loggers
from juniorguru.sync.jobs_scraped.pipelines.boards_ids import process as boards_ids


logger = loggers.get('juniorguru.sync.jobs_posted')


DOC_KEY = '1TO5Yzk0-4V_RzRK5Jr9I_pF5knZsEZrNn2HKTXrHgls'

FIRST_ROW_NO = 2  # skipping sheet header

IMPLICIT_EXPIRATION_DAYS = 30


class DropItem(Exception):
    pass


@measure('jobs_posted')
@db.connection_context()
def main():
    PostedJob.drop_table()
    PostedJob.create_table()

    rows = google_sheets.download(google_sheets.get(DOC_KEY, 'jobs'))
    for row_no, row in enumerate(rows, start=FIRST_ROW_NO):
        try:
            job = PostedJob.create(**coerce_record(row))
            logger.info(f"Row {row_no} saved as {job!r}")
        except DropItem as e:
            logger.info(f"Row {row_no} dropped. {e}")


def coerce_record(record, today=None):
    data = coerce({
        r'^nadpis pracovní nabídky$': ('title', parse_text),
        r'^timestamp$': ('posted_at', parse_datetime),
        r'^expire[ds]$': ('expires_on', parse_date),
        r'^approved$': ('approved_on', parse_date),
        r'^email address$': ('apply_email', parse_text),
        r'^externí odkaz na pracovní nabídku$': ('apply_url', parse_url),
        r'^název firmy$': ('company_name', parse_text),
        r'^odkaz na webové stránky firmy$': ('company_url', parse_url),
        r'^město, kde se nachází kancelář$': ('locations_raw', parse_locations),
        r'^je práce na dálku\?$': ('remote', parse_boolean_words),
        r'^pracovní poměr$': ('employment_types', parse_set),
        r'^text pracovní nabídky$': ('description_html', parse_markdown),
        r'\bkup[óo]n\b': ('coupon', parse_boolean),
    }, record)

    if not data.get('approved_on'):
        raise DropItem(f"Not approved: {data['title']!r} posted on {data['posted_at']:%Y-%m-%d}")
    data['posted_on'] = data['approved_on']

    if not data.get('expires_on'):
        data['expires_on'] = data['approved_on'] + timedelta(days=IMPLICIT_EXPIRATION_DAYS)

    today = today or date.today()
    if data['expires_on'] <= today:
        raise DropItem(f"Expiration {data['expires_on']:%Y-%m-%d} ≤ today {today:%Y-%m-%d}")

    data['id'] = create_id(data['posted_at'], data['company_url'])
    data['url'] = f"https://junior.guru/jobs/{data['id']}/"
    data['lang'] = langdetect.detect(remove_tags(data['description_html']))
    data = boards_ids(data)

    return data


def parse_locations(location):
    if location:
        return [loc.strip() for loc in re.split(r'\snebo\s', location)]
    return []


def parse_markdown(value):
    if value:
        return md(value.strip())


def create_id(posted_at, company_link):
    url_parts = urlparse(company_link)
    seed = f'{posted_at:%Y-%m-%dT%H:%M:%S} {url_parts.netloc}'
    return hashlib.sha224(seed.encode()).hexdigest()
