import pytest
from invoke import Collection, Exit, task

from juniorguru.utils import checks
from juniorguru.utils.screenshots import main as screenshots
from juniorguru.utils.students import main as students
from juniorguru.utils.participant import main as participant
from juniorguru.utils.winners import main as winners

from . import sync, web


@task(incrementable=['v'])
def test(context, v=0, x=False):
    args = (v * ['-v']) + (int(x) * ['-x'])
    code = pytest.main(args)
    if code:
        raise Exit(code=code)


@task()
def lint(context):
    context.run('poetry run flake8')
    context.run("npx stylelint 'juniorguru/scss/**/*.*css' 'juniorguru/image_templates/*.*css'")


@task()
def format(context):
    context.run('poetry run isort .')


namespace = Collection(test, lint, format, screenshots, winners, students, participant, sync, web, checks)
