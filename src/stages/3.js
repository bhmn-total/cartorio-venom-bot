import { storage } from "../storage.js";
import { VenomBot } from "../venom.js";

export const stageThree = {
    async exec({from, message = ''}) {

      message = message.trim() || ''

      const bot = VenomBot.getInstance();
      const pattern = /[0-9]{1}/;
      const valid = pattern.test(message);

      const { lastOptions = [], lastMsg = '' } = storage[from];

      if (!valid) {
        await bot.sendText({to: from, message: 'Opção inválida, apenas números são válidos.'});
        await bot.sendText({to: from, message: lastMsg});
      } else {
        const selectedNumber = parseInt(message);
        const selectedOption = lastOptions.find(op => op.MENU_SEQUENCIA === selectedNumber);
        if (!selectedOption) {
          await bot.sendText({to: from, message: 'Opção enviada inválida, apenas números são válidos.'});
          await bot.sendText({to: from, message: lastMsg});
        } else {
          await bot.sendText({to: from, message: selectedOption.TITULO});
          if (selectedOption.ACAO !== 'TEXTO') {
            console.log('Executar query {}...', selectedOption.ACAO);
          } else {
            delete storage[from];
            await bot.sendText({to: from, message: 'Atendimento encerrado.'});
          }
        }
      }

      
    }
  }