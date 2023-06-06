import { VenomBot } from './venom.js'
import { stages, getStage } from './stages.js'
import { storage } from './storage.js';

const main = async () => {
  try {
    const venombot = await VenomBot.getInstance().init({
      session: 'Bot do Arthur',
      headless: true,
      useChrome: false
    });

    venombot.onMessage(async (message) => {
      if (message.isGroupMsg) return

      const { from, body } = message;

      if (body?.toUpperCase() === 'SAIR') {
        delete storage[from];
        await VenomBot.getInstance().sendText({to: from, message: 'Obrigado pelo contato.\nAtendimento encerrado.'});
      } else {
        const currentStage = getStage({ from })

        await stages[currentStage].stage.exec({
          from, message: body, sender: message.sender
        });
      }
    })
  } catch (error) {
    console.error(error);
  }
}

main()