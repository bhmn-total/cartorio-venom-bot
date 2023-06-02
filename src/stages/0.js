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
            Bem vindo(a) ao atendimento de cartórios. 
            Para iniciarmos, informe o número TJ do Cartório cadastrado (apenas números) :';
            `
            await venombot.sendText({ to: from, message: msg })
        } else {
            console.log(from, message);
        }
    }
  }
}