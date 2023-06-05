import { storage } from '../storage.js'
import { STAGES } from './index.js'
import { findMenu } from '../db/db_local_config_bd.js';
import { VenomBot } from '../venom.js';

const handleShowMenu = async (rows, from) => {
  const bot = VenomBot.getInstance();
  if (!rows || rows.length === 0) {
    const errorMsg = `Não foram encontradas as opções de atendimento da serventia ${storage[from].serventia?.DESCRICAO}.\n
    Atendimento encerrado.`;
    storage[from].stage = STAGES.INITIAL;
    await bot.sendText({ to: from, message: errorMsg});
  } else {
    let msg = 'Digite apenas o número da opção desejada:\n\n';
    rows = rows.forEach(m => {
      msg += `${m.MENU_SEQUENCIA} - ${m.DESCRICAO}\n`;
    });
    storage[from].stage = STAGES.SECOND_MENU;
    storage[from].lastOptions = rows;
    storage[from].lastMsg = msg;
    await bot.sendText(from, msg);
  }
}

export const stageTwo = {
  async exec({ from, lastOption }) {
    const serventia = storage[from].serventia;
    const [ rows, fields ] = await findMenu(serventia.ID, lastOption.ID);
    await handleShowMenu(rows, from);
  }
}