import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js'

export const initialStage = {
  async exec({from, message = ''}) {
    if (message) {
      storage[from].stage = STAGES.WELCOME

      const venombot = await VenomBot.getInstance()

      const msg = `Bem vindo(a) ao atendimento de cartórios.\nPara iniciarmos, informe o número TJ do Cartório cadastrado (apenas números):`
      await venombot.sendText({ to: from, message: msg });
    }
  }
}