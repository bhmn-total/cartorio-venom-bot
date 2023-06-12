import { storage } from "../storage.js";
import { VenomBot } from "../venom.js";
import { STAGES } from "./index.js";

export const stageThree = {
    async exec({from, message = '', to}) {

      message = message.trim() || ''

      const bot = VenomBot.getInstance();
      const pattern = /[0-9]{1}/;
      const valid = pattern.test(message);

      const { lastOptions = [], lastMsg = '' } = storage[from];

      if (!valid) {
        await bot.sendText({session: to, to: from, message: 'Opção inválida, apenas números são válidos.'});
        await bot.sendText({session: to, to: from, message: lastMsg});
      } else {
        const selectedNumber = parseInt(message);
        const selectedOption = lastOptions.find(op => op.MENU_SEQUENCIA === selectedNumber);
        if (!selectedOption) {
          await bot.sendText({session: to, to: from, message: 'Opção enviada inválida, apenas números são válidos.'});
          await bot.sendText({session: to, to: from, message: lastMsg});
        } else {
          await bot.sendText({session: to, to: from, message: selectedOption.TITULO});
          if (selectedOption.ACAO !== 'TEXTO') {
            storage[from].lastMsg = selectedOption.TITULO;
            storage[from].stage = STAGES.SEARCH_MENU;
            storage[from].action = selectedOption.ACAO;
          } else {
            delete storage[from];
            await bot.sendText({session: to, to: from, message: 'Atendimento encerrado.'});
          }
        }
      }

      
    }
  }