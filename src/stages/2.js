import { VenomBot } from '../venom.js'
import { storage } from '../storage.js'
import { STAGES } from './index.js'

export const stageTwo = {
  async exec({from, message = ''}) {
    message = message.trim() || '';
    const bot = VenomBot.getInstance();

    let msg = `Tenha um ótimo dia.`
    if (message.toUpperCase() == 'SAIR') {
        msg = `
            Que pena que não pude ajudar.
            Ainda assim, que você ${msg.toLowerCase()}
        `;
    } else {
    //     msg = `
    //         Obrigado pela mensagem, ${message}! 😀
    //         ${msg} ❤️
    //     `;
    }
    storage[from].stage = STAGES.INITIAL

    await VenomBot.getInstance().sendText({ to: from, message: msg })
  }
}