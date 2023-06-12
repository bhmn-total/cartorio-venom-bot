import { create } from 'venom-bot'

export class VenomBot {
  
  #bots = [];

  static getInstance() {
    if (VenomBot.instance === undefined) VenomBot.instance = new VenomBot()
    return VenomBot.instance
  }

  async init({ session, headless, useChrome, onMessage }) {
    const bot = await create({
      session,
      headless,
      useChrome,
      multidevice: false
    });
    bot.onMessage(onMessage);
    this.#bots.push({session, bot});

    return this;
  }

  findBySession (session = '') {
    return this.#bots.find(b => b.session === session);
  }

  async sendText({ session = '', to, message }) {
    const bot = this.findBySession(session);
    if (!bot) throw new Error('VenomBot not initialized.');
    return await bot.bot.sendText(to, message);
  }
}