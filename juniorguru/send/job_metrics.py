from pathlib import Path
from urllib.parse import quote_plus

from jinja2 import Template

from juniorguru.lib.emails import create_message
from juniorguru.models import Job


def generate_messages(today, debug=False):
    jobs = Job.juniorguru_listing()

    template_path = Path(__file__).parent / 'templates' / 'job_metrics.html'
    template = Template(template_path.read_text())

    for job in jobs:
        message_data = prepare_message_data(job, template, today, debug=debug)
        yield create_message(**message_data)


def prepare_message_data(job, template, today, debug=False):
    if job.expires_soon(today):
        subject = 'Váš inzerát brzy vyprší!'
    else:
        subject = 'Jak se daří vašemu inzerátu?'
    subject = f'{subject} ({job.title})'

    from_email = ('junior.guru', 'metrics@junior.guru')
    bcc_emails = []
    content = template.render(**prepare_template_context(job, today))

    if debug:
        to_emails = [(job.company_name, 'ahoj@junior.guru')]
        subject = f'[DEBUG] {subject}'
    else:
        to_emails = [(job.company_name, job.email)]
        bcc_emails = [('junior.guru', 'ahoj@junior.guru')]

    return dict(from_email=from_email, to_emails=to_emails,
                bcc_emails=bcc_emails, subject=subject, html_content=content)


def prepare_template_context(job, today):
    return dict(title=job.title,
                company_name=job.company_name,
                company_name_urlencoded=quote_plus(job.company_name),
                pricing_plan=job.pricing_plan,
                url=f'https://junior.guru/jobs/{job.id}/',
                url_jobs='https://junior.guru/jobs/',
                url_index='https://junior.guru/',
                url_logo='https://junior.guru/static/images/logo-email.png',
                metrics=job.metrics,
                start_at=job.posted_at,
                start_days=job.days_since_posted(today),
                end_at=job.expires_at,
                end_days=job.days_until_expires(today),
                expires_soon=job.expires_soon(today),
                newsletter_mentions=job.newsletter_mentions,
                newsletter_archive_url='https://us3.campaign-archive.com/home/?u=7d3f89ef9b2ed953ddf4ff5f6&id=e231b1fb75')
