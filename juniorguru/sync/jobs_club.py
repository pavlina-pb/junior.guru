import asyncio
import re
from datetime import date, timedelta

from juniorguru.lib import loggers
from juniorguru.lib.club import (DISCORD_MUTATIONS_ENABLED, JOBS_CHANNEL,
                                 run_discord_task)
from juniorguru.lib.tasks import sync_task
from juniorguru.models.base import db
from juniorguru.models.club import ClubMessage
from juniorguru.models.job import ListedJob
from juniorguru.sync.jobs_listing import main as jobs_listing_task


JOBS_REPEATING_PERIOD_DAYS = 30

URL_RE = re.compile(r'https?://\S+', re.I)


logger = loggers.get(__name__)


@sync_task(jobs_listing_task)
def main():
    run_discord_task('juniorguru.sync.jobs_club.discord_task')


@db.connection_context()
async def discord_task(client):
    since_at = date.today() - timedelta(days=JOBS_REPEATING_PERIOD_DAYS)
    logger.info(f'Figuring out which jobs are not yet in the channel since {since_at}')
    messages = ClubMessage.channel_listing_since(JOBS_CHANNEL, since_at)
    urls = frozenset(filter(None, (get_first_url(message.content) for message in messages)))
    logger.info(f'Found {len(urls)} jobs since {since_at}')
    jobs = [job for job in ListedJob.listing() if job.effective_url not in urls]
    logger.info(f'Posting {len(jobs)} new jobs to the channel')
    discord_channel = await client.fetch_channel(JOBS_CHANNEL)
    if DISCORD_MUTATIONS_ENABLED:
        await asyncio.gather(*[post_job(discord_channel, job) for job in jobs])
    else:
        logger.warning('Discord mutations not enabled')


async def post_job(discord_channel, job):
    logger_p = logger.getChild(str(job.id))
    logger_p.info(f'Posting {job!r}: {job.effective_url}')
    content = f'**{job.title}**\n{job.company_name} – {job.location}\n{job.effective_url}'
    discord_message = await discord_channel.send(content)
    await discord_message.add_reaction('👍')
    await discord_message.add_reaction('👎')


def get_first_url(message_content):
    match = URL_RE.search(message_content)
    if match:
        return match.group(0)
    return None
