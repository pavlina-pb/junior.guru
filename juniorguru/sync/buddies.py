from datetime import timedelta

from juniorguru.lib import loggers
from juniorguru.lib.club import (DISCORD_MUTATIONS_ENABLED, is_message_over_period_ago,
                                 run_discord_task, MENTORING_CHANNEL)
from juniorguru.lib.tasks import sync_task
from juniorguru.models.base import db
from juniorguru.models.club import ClubMessage
from juniorguru.sync.club_content import main as club_content_task


BUDDIES_CHANNEL = 822415540843839488

BUDDIES_EMOJI = '💡'


logger = loggers.get(__name__)


@sync_task(club_content_task)
def main():
    run_discord_task('juniorguru.sync.buddies.discord_task')


@db.connection_context()
async def discord_task(client):
    last_message = ClubMessage.last_bot_message(BUDDIES_CHANNEL, BUDDIES_EMOJI)
    if is_message_over_period_ago(last_message, timedelta(days=30)):
        logger.info('Last message is more than one month old!')
        if DISCORD_MUTATIONS_ENABLED:
            channel = await client.fetch_channel(BUDDIES_CHANNEL)
            await channel.send(content=(
                f"{BUDDIES_EMOJI} Nezapomeň, že si tady můžeš hledat parťáky na společné učení "
                "nebo projekt. Pokud utvoříte skupinu, napište <@!668226181769986078> "
                "a vytvoří vám tady v klubu roli a soukromý kanál, kde se můžete domlouvat. "
                "Hlasový kanál **klubovna** může kdokoliv z klubu využívat k volání jak potřebuje, "
                "takže si tam klidně můžete dávat schůzky."
                "\n\n"
                "💁 Pomohlo by ti pravidelně si s někým na hodinku zavolat a probrat svůj postup? "
                f"Mrkni do <#{MENTORING_CHANNEL}>, kde je seznam členů, kteří se k takovým "
                "konzultacím nabídli."
            ))
        else:
            logger.warning('Discord mutations not enabled')
