import { VenomBot } from './venom.js'
import { stages, getStage } from './stages.js'
import { storage } from './storage.js';
import { STAGES } from './stages/index.js';

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
        storage[from] = STAGES.INITIAL;
        await venombot.sendText(from, 'Atendimento Finalizado.');
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