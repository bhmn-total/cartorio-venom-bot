import { create } from 'venom-bot'

export class VenomBot {
  
  #bots = [];

  static getInstance() {
    if (VenomBot.instance === undefined) VenomBot.instance = new VenomBot()
    return VenomBot.instance
  }

  async init({ session, headless, useChrome }) {
    const bot = await create({
      session,
      headless,
      useChrome,
      multidevice: false
    });
    this.#bots.push({session, bot});

    return bot;
  }

  findBySession (session = '') {
    return this.#bots.find(b => b.session === session)?.bot;
  }

  async sendText({ session = '', to, message }) {
    const bot = this.findBySession(session);
    if (!bot) throw new Error('VenomBot not initialized.');
    return await bot.sendText(to, message).catch(error => {
      console.error('Erro ao enviar mensagens: {}', error);
    });
  }
}