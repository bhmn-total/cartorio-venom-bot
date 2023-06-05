import { STAGES } from "./index.js";
import { findServentiasBdConfig } from "../db/db_local_config_bd.js";
import { storage } from "../storage.js"
import { VenomBot } from "../venom.js";
import { findFirmas, findRgi, getServentiasConn } from "../db/db_serventias_operations.js";

export const stageFour = {
    async exec({ from, message }) {
        const bot = VenomBot.getInstance();
        const { serventia, action, lastMsg } = storage[from];
        const [ rows ] = await findServentiasBdConfig(serventia.ID);
        if (rows.length == 0) {
            bot.sendText({to: from, message: 'Informações necessárias para a consulta dos dados da Serventia não encontradas.\nEntre em contato com o cartório.\nAtendimento finalizado.'});
            storage[from].stage = STAGES.INITIAL;
        } else {
            
            const pattern = /[0-9]{1,}/;
            const valid = pattern.test(message);
            if (!valid) {
                await bot.sendText({to: from, message: 'Opção inválida, apenas números são válidos.'});
                await bot.sendText({to: from, message: lastMsg});
            } else {
                console.log('Executar query {}...', action);
                const config = rows[0];
                const conn = await getServentiasConn({ 
                    host: config.HOST, user: config.USER, database: config.BD_NAME, password: config.BD_PASS });
                let queryPromise = null;
                if (action.contains('RGI')) {
                    queryPromise =  findRgi(message, conn);
                } else if (action.contains('FIRMAS')) {
                    queryPromise = findFirmas(message, conn);
                }

                if (queryPromise) {
                    queryPromise.then(rows => console.log(rows))
                        .catch(error => console.log(error))
                        .finally(() => conn.terminate());
                }
            }
        }
        
    }
}