import { STAGES } from "./index.js";
import { getStage, stages } from "../stages.js";
import { storage } from "../storage.js";

export const stageFive = {
    async exec({from, message}) {
        const { serventia } = storage[from];
        if (message.toUpperCase() === 'MENU') {
            storage[from].stage = STAGES.WELCOME;
            const currentStage = getStage({ from });

            await stages[currentStage].stage.exec({ from, message: `${serventia.CODIGO_TJ}` })
        } else {
            const bot = VenomBot.getInstance();
            delete storage[from];
            bot.sendText({to: from, message: 'Obrigado pelo contato.\nAtendimento encerrado.'});
        }
    }
}