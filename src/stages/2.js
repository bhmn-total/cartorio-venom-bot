import { storage } from '../storage.js'
import { STAGES } from './index.js'
import { findMenu } from '../db/db_config_bd.js';
import { VenomBot } from '../venom.js';

const handleShowMenu = async (err, rows, from) => {
  const bot = VenomBot.getInstance();
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
    rows = rows.map(m => {
      m.title = m.DESCRICAO;
      return m;
    });
    const [ result ] = await bot.sendButtons(from, 'Opções', 'Opções', rows);
    storage[from].lastOption = result;
    storage[from].stage = STAGES.SECOND_MENU;
    await bot.sendText(from, result.TITULO);
  }
}

export const stageTwo = {
  async exec({ from }) {
    const serventia = storage[from].serventia;
    const lastOption = storage[from].lastOption;
    const [ err, rows ] = await findMenu(serventia.ID, lastOption.ID);
    await handleShowMenu(err, rows, from);
  }
}