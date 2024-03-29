import { createPool } from 'mysql2';

let pool = null;

const getPool = () => {
    pool = pool ? pool : createPool({
        host: 'cartorio-bot-bd',
        user: 'root',
        password: 'admin',
        database: 'bot-config-bd',
        connectionLimit: 10
    });
    return pool;
}

const findServentiaByCodigoTj = (codigoTj = 0) => {
    return getPool().promise().query('SELECT * FROM SERVENTIAS WHERE CODIGO_TJ = ?', [ codigoTj ]);
}

const findServentiaByNumCel = (numCel = '') => {
    return getPool().promise().query('SELECT * FROM SERVENTIAS WHERE NUM_CEL = ?', [ numCel ]);
}

const findValidNumsCel = () => {
    return getPool().promise().query('SELECT NUM_CEL FROM SERVENTIAS WHERE NUM_CEL IS NOT NULL');
}

const findFirstLevelMenu = (serventiaId = 0) => {
    return getPool().promise().query(`
            SELECT B.*, A.ACAO, A.TITULO
            FROM BOTMENU B 
            INNER JOIN ACAO_RETORNO A ON A.ID = B.ACAO_MENU_ID
            WHERE B.SERVENTIA_ID = ? AND B.MENU_PAI_ID IS NULL`, 
        [ serventiaId ]
    );
}

const findMenu = (serventiaId = 0, menuPaiId = 0) => {
    return getPool().promise().query(`
            SELECT B.*, A.ACAO, A.TITULO
            FROM BOTMENU B 
            INNER JOIN ACAO_RETORNO A ON A.ID = B.ACAO_MENU_ID
            WHERE B.SERVENTIA_ID = ? AND B.MENU_PAI_ID = ?`, 
        [ serventiaId, menuPaiId ]
    );
}

const findServentiasBdConfig = (serventiaId = 0) => {
    return getPool().promise().query(`
            SELECT C.*
            FROM SERVENTIA_BD_CONFIG C 
            WHERE C.SERVENTIA_ID = ?`, 
        [ serventiaId ]
    );
}

export {
    findMenu, 
    findFirstLevelMenu, 
    findServentiaByCodigoTj, 
    findServentiasBdConfig, 
    findServentiaByNumCel,
    findValidNumsCel
}