import { findServentiaByCodigoTj } from '../db/db_config_bd.js';
import { VenomBot } from '../venom.js'

export const stageOne = {
  async exec({from, message = ''}) {
    message = message.trim() || ''

    const pattern = /[0-9]{6}/;
    const valid = pattern.test(message);
    const bot = VenomBot.getInstance();
    if (!valid) {
      const msg = 'Valor do código da serventia inválido. Por favor, digite novamente.';
      await bot.sendText({ to: from, message: msg })
    } else {
      findServentiaByCodigoTj(parseInt(message), async (error, results, fields) => {
        console.log(error, results, fields);
        // if "serventia" encontrada, buscar menu inicial da serventia, e exibir as opções filhas...
        // else exibir mensagem de erro e terminar o atendimento.
        // const msg = 'Bem vindo(a) ao atendimento de cartórios. Para iniciarmos, informe o número TJ do Cartório cadastrado (apenas números) :';
        // await bot.sendText({ to: from, message: msg })  
      });
       
    }

    
  }
}