import { findMenu, findServentiaByCodigoTj } from '../db/db_config_bd.js';
import { stages } from '../stages.js';
import { storage } from '../storage.js';
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js';

const handleServentia = async (err, rows, from, bot) => {
  // if "serventia" encontrada, buscar menu inicial da serventia, e exibir as opções filhas...
  // else exibir mensagem de erro e terminar o atendimento.
  if (err) {
    storage[from].stage = STAGES.INITIAL;
    await bot.sendText({ to: from, message: `
    Erro interno encontrado no servidor ao buscar código da serventia. 
    Atendimento encerrado, tente novamente mais tarde.`});
  } else if (!rows || rows.length === 0) {
    await bot.sendText({ to: from, message: 'Código da serventia não encontrado. Por favor, tente novamente.'});
  } else {
    const serventia = rows[0];
    storage[from].serventia = serventia;
    const [err, rows] = await findMenu(serventia.ID, null);
    await handleOptions(err, rows, from, bot);
  }
}

const handleOptions = async (err, rows, from, bot) => {

  let errorMsg = null;
  const serventia = storage[from].serventia;
  if (err) {
    errorMsg = `
    Erro interno encontrado no servidor ao buscar código da serventia. 
    Atendimento encerrado, tente novamente mais tarde.
    `;
  } else if (!rows || rows.length === 0) {
    errorMsg = `
    Não foram encontradas as opções de atendimento da serventia ${serventia.DESCRICAO}.
    Atendimento encerrado.
    `;
  }
  if (errorMsg) {
    storage[from].stage = STAGES.INITIAL;
    await bot.sendText({ to: from, message: errorMsg});
  } else {
    const menuPrincipal = rows[0];
    const msg = `
      Serventia ${serventia.DESCRICAO} encontrada.
      ${menuPrincipal.TITULO}
    `;
    storage[from].stage = STAGES.FIRST_MENU;
    await bot.sendText({ to: from, message: msg });

    await stages[storage[from].stage].stage.exec({
      from: message.from,
      lastOption: menuPrincipal
    });
  }
}

export const stageOne = {
  async exec({from, message = ''}) {
    message = message.trim() || ''

    const pattern = /[0-9]{4,6}/;
    const valid = pattern.test(message);
    const bot = VenomBot.getInstance();
    if (!valid) {
      const msg = 'Valor do código da serventia inválido. Por favor, digite novamente.';
      await bot.sendText({ to: from, message: msg })
    } else {
      const [err, rows] = await findServentiaByCodigoTj(parseInt(message));
      await handleServentia(err, rows, from, bot);
    }
  }
}

