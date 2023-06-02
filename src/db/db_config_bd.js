import { createPool } from 'mysql';

let pool = null;

const getPool = () => {
    pool = pool ? pool : createPool({
        host: 'cartorio-bot-bd',
        user: 'root',
        password: 'admin',
        connectionLimit: 10
    });
    return pool;
}

const findServentiaByCodigoTj = (codigoTj = 0, returnFn = (error, results, fields) => {}) => {
    getPool().query({
        query: 'SELECT * FROM SERVENTIAS WHERE CODIGO_TJ = ?', 
        values: [ codigoTj ]
    }, returnFn);
}

const findMenu = (serventiaId = 0, menuPaiId = 0, returnFn = (error, results, fields) => {}) => {
    getPool().query({
        query: 'SELECT * FROM BOTMENU WHERE SERVENTIA_ID = ? AND MENU_PAI_ID = ?', 
        values: [ serventiaId, menuPaiId ]
    }, returnFn);
}

export {
    findMenu, findServentiaByCodigoTj
}