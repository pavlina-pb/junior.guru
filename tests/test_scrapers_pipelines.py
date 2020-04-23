from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile

import pytest
from scrapy import Spider
from scrapy.exceptions import DropItem
from peewee import SqliteDatabase

from juniorguru.scrapers import pipelines
from juniorguru.models import Job


@pytest.fixture
def item():
    return dict(
        posted_at=datetime.utcnow(),
        title='Junior Python Engineer',
        location='Brno, Czechia',
        company_name='The Best Company',
        company_link='https://example.com',
        employment_types=['full-time'],
        description_raw='...',
        link='https://example.com/jobs/123',
    )


@pytest.fixture
def spider():
    class DummySpider(Spider):
        name = 'dummy'

    return DummySpider()


@pytest.mark.parametrize('description_raw,expected_lang', [
    ('''<p>Baví nás e-commerce a proto jsme se před rokem pustili do tvorby
     aplikací pro <a href="https://www.shopify.com/">Shopify.com</a>.
     Provozujeme více aplikací, např. Candyrack, zaměřené na performance
     marketing a dnes je využívají stovky e-shopů z celého světa.</p>''',
     'cs'),
    ('''V súčasnosti hľadáme inžiniera zameraného na cloud, pre spoločnosť
     špecializujúcou sa na poisťovníctvo na svojom trhu na Slovensku,
     spoločnosť pôsobí okrem Slovenska vo viacerých krajinách sveta.''',
     'sk'),
    ('''Help companies that use the Prague-based AI startup
     <strong>Rossum</strong> get started (...to stop wasting time on manual
     data entry when dealing with business documents).''',
     'en'),
])
def test_language_filter(item, spider, description_raw, expected_lang):
    item['description_raw'] = description_raw
    language_filter = pipelines.LanguageFilter()
    item = language_filter.process_item(item, spider)

    assert item['lang'] == expected_lang


@pytest.mark.parametrize('description_raw', [
    '''<p><strong>Was dich\xa0bei uns erwartet:\xa0</strong></p>\r\n<p>Als
    Big Data Systems Engineer bist du bei unseren Kunden für die Konzeption,
    Installation und Konfiguration der Linux- und Cloud-basierten
    Big-Data-Lösungen verantwortlich. Ebenfalls zu deinen Aufgaben gehören
    die Bewertung bestehender Big-Data-Systeme und die''',
])
def test_language_filter_drops(item, spider, description_raw):
    item['description_raw'] = description_raw
    language_filter = pipelines.LanguageFilter()

    with pytest.raises(DropItem):
        language_filter.process_item(item, spider)


@pytest.fixture
def db():
    # Using tmp file because we need to test opening and closing a db conn
    # here and the :memory: sqlite db ceases to exist with the conn closed
    tmp_file = NamedTemporaryFile(delete=False)
    db_path = Path(tmp_file.name)
    tmp_file.close()
    db = SqliteDatabase(tmp_file.name)
    with db:
        Job.bind(db)
        Job.create_table()
    yield db
    if db_path.exists():
        db_path.unlink()


def test_database(item, spider, db):
    database = pipelines.Database(db=db, job_cls=Job)
    database.open_spider(spider)
    database.process_item(item, spider)
    database.close_spider(spider)
    with db:
        job = Job.select()[0]

    assert len(job.id) == 56  # sha224 hex digest length
    assert job.source == 'dummy'  # spider name
    assert job.is_approved is False
