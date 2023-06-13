import { VenomBot } from './venom.js'
import { stages, getStage } from './stages.js'
import { storage } from './storage.js';
import { findValidNumsCel } from './db/db_local_config_bd.js';

const onMessage = async (message) => {
  if (message.isGroupMsg) return

  const { from, body, to } = message;
  let session = to.replace(/\D/g, '');
  if (body?.toUpperCase() === 'SAIR') {
    delete storage[from];
    await VenomBot.getInstance().sendText({session, to: from, message: 'Obrigado pelo contato.\nAtendimento encerrado.'});
  } else {
    const currentStage = getStage({ from })
    await stages[currentStage].stage.exec({
      from, message: body, sender: message.sender, to: session
    });
  }
}

const initBot = async (numCel) => {
  VenomBot.getInstance().init({
    session: numCel,
    headless: true,
    useChrome: false, 
    onMessage
  }).then(client => {
    client.onMessage(onMessage);
  }).catch (error => {
    console.error(`Erro ao iniciar client para o número ${numCel}.`, error);
  });
}

const main = async () => {
  const [rows, fields] = await findValidNumsCel();
  rows.forEach(row => initBot(row.NUM_CEL));
}

try {
  main()  
} catch (error) {
  console.log('Erro não tratado: {}', error);
}
