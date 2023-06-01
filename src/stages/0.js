import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js'

export const initialStage = {
  async exec({from, message = ''}) {
    if (message) {
        const receivedMessage = message.trim() || '';
        if (receivedMessage.toUpperCase() === 'INICIAR BOT') {
            storage[from].stage = STAGES.WELCOME

            const venombot = await VenomBot.getInstance()

            const msg = `
            👋 Olá, como vai?
            Eu sou o bot da ${venombot.getSessionName}.
            Digite o seu nome ou 'Sair' caso deseje que eu vá embora...
            `
            await venombot.sendText({ to: from, message: msg })
        } else {
            console.log(from, message);
        }
    }
  }
}