import { STAGES } from "./index.js";
import { findServentiasBdConfig } from "../db/db_local_config_bd.js";
import { storage } from "../storage.js"
import { VenomBot } from "../venom.js";
import { findFirmas, findRgi, getServentiasConn } from "../db/db_serventias_operations.js";

const endMessage = `-----------------------------\n` +
'Obrigado pelo contato.\nCaso deseje iniciar outro atendimento, digite "MENU"';

const printRgi = async (resultRows, from, bot) => {
    const row  = resultRows[0];
    let msg = `Protocolo: ${row.PROTOCOLO}\n` +
    `Talão: ${row.TALAO}\n` +
    `Status: ${row.STATUS}\n` +
    `Natureza: ${row.DESC_NATUREZA}\n` +
    `Apresentante: ${row.NOME_APRESENTANTE}\n` +
    `Data de Entrada: ${row.DATA_ENTRADA}\n` +
    `Data da Prática: ${row.DATA_PRATICA}\n${endMessage}`
    await bot.sendText({to: from, message: msg});
}

const printFirmas = async (resultRows, from, bot) => {
    const row = resultRows[0];
    let msg = `Nome: ${row.NOME}\n` +
    `Data Cadastro: ${row.DATA_CADASTRO}\n` +
    `\n${endMessage}`;
    await bot.sendText({to: from, message: msg});
}

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
                let resultFn = null;
                if (action.includes('RGI')) {
                    queryPromise =  findRgi(message, conn);
                    resultFn = printRgi;
                } else if (action.includes('FIRMAS')) {
                    queryPromise = findFirmas(message, conn);
                    resultFn = printFirmas;
                }

                if (queryPromise && resultFn) {
                    try {
                        const [ responseRows ] = await queryPromise;   
                        if (responseRows.length === 0) {
                            await bot.sendText({to: from, message: 'Nenhum resultado encontrado. Tente novamente.'});
                            await bot.sendText({to: from, message: lastMsg});
                        } else {                        
                            storage[from].stage = STAGES.INITIAL;
                            await resultFn(responseRows, from, bot);
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        conn.end();
                    }
                } else {
                    conn.end();
                }
            }
        }
        
    }
}