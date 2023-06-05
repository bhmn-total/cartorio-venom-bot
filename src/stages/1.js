import { findFirstLevelMenu, findMenu, findServentiaByCodigoTj } from '../db/db_local_config_bd.js';
import { stages } from '../stages.js';
import { storage } from '../storage.js';
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js';

const handleServentia = async (resultRows, from, bot) => {
  // if "serventia" encontrada, buscar menu inicial da serventia, e exibir as opções filhas...
  // else exibir mensagem de erro e terminar o atendimento.
  
  if (!resultRows || resultRows.length === 0) {
    await bot.sendText({ to: from, message: 'Código da serventia não encontrado. Por favor, tente novamente. Digite o número do TJ da serventia:'});
  } else {
    const serventia = resultRows[0];
    storage[from].serventia = serventia;
    const [rows, fields] = await findFirstLevelMenu(serventia.ID);
    await handleOptions(rows, from, bot);
  }
}

const handleOptions = async (resultRows, from, bot) => {

  let errorMsg = null;
  const serventia = storage[from].serventia;
  if (!resultRows || resultRows.length === 0) {
    errorMsg = `Não foram encontradas as opções de atendimento da serventia ${serventia.DESCRICAO}.\nAtendimento encerrado.`;
  }
  if (errorMsg) {
    storage[from].stage = STAGES.INITIAL;
    await bot.sendText({ to: from, message: errorMsg});
  } else {
    const menuPrincipal = resultRows[0];
    const msg = `Serventia ${serventia.DESCRICAO} encontrada.\n${menuPrincipal.TITULO}`;
    storage[from].stage = STAGES.FIRST_MENU;
    await bot.sendText({ to: from, message: msg });

    await stages[storage[from].stage].stage.exec({
      from, lastOption: menuPrincipal
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
      const [rows, fields] = await findServentiaByCodigoTj(parseInt(message));
      await handleServentia(rows, from, bot);
    }
  }
}

