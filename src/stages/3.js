import { storage } from "../storage.js";

export const stageThree = {
    async exec({from, message = ''}) {

      message = message.trim() || ''

      const bot = VenomBot.getInstance();
      const pattern = /[0-9]{1}/;
      const valid = pattern.test(message);

      if (!valid) {
        await bot.sendText(from, 'Opção inválida, apenas números são válidos.');
        await bot.sendText(from, storage[from].lastMsg);
      } else {
        const selectedNumber = parseInt(message);
        const lastOptions = storage[from].lastOptions;
        const selectedOption = lastOptions.find(op => op.MENU_SEQUENCIA === selectedNumber);
        if (!selectedOption) {
          await bot.sendText(from, 'Opção enviada inválida, apenas números são válidos.');
          await bot.sendText(from, storage[from].lastMsg);
        } else {
          await bot.sendText(from, selectedOption.TITULO);
          if (selectedOption.ACAO !== 'TEXTO') {
            console.log('Executar query {}...', selectedOption.ACAO);
          } else {
            delete storage[from];
            await bot.sendText(from, 'Atendimento encerrado.');
          }
        }
      }

      
    }
  }