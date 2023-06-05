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

export {
    findMenu, findFirstLevelMenu, findServentiaByCodigoTj
}