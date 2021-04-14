import sys
from pathlib import Path

from peewee import Model, SqliteDatabase, CharField, IntegerField


ERROR_RATE_THRESHOLD = 5


db_file = Path(__file__).parent.parent / 'juniorguru' / 'data' / 'data.db'
db = SqliteDatabase(db_file)


class JobError(Model):
    class Meta:
        database = db

    message = CharField()
    source = CharField()


class SpiderMetric(Model):
    class Meta:
        database = db

    spider_name = CharField()
    name = CharField(index=True)
    value = IntegerField()


with db:
    job_errors = list(JobError.select())
    spider_errors = list(SpiderMetric.select().where(SpiderMetric.name == 'log_count/ERROR'))
    spider_items_count = sum([metric.value for metric in
                              SpiderMetric.select().where(SpiderMetric.name.startswith('item_') & SpiderMetric.name.endswith('_count'))])

if job_errors:
    print(f'Found {len(job_errors)} job errors.', file=sys.stderr)
    for job_error in job_errors:
        print(f'💥 {job_error.source}: {job_error.message}')
    sys.exit(1)

if spider_errors:
    print(f'Found {len(spider_errors)} spiders with uncaught errors.', file=sys.stderr)
    for spider_error in spider_errors:
        print(f'💥 {spider_error.spider_name}: {spider_error.name}={spider_error.value}')

    errors_count = sum([metric.value for metric in spider_errors])
    error_rate = 100 * errors_count / spider_items_count
    print(f'Total items {spider_items_count}, errors {errors_count}. Error rate is {error_rate}, threshold is {ERROR_RATE_THRESHOLD}.')
    if error_rate >= ERROR_RATE_THRESHOLD:
        sys.exit(1)
print('OK', file=sys.stderr)
