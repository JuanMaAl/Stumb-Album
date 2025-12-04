// src/utils/getStumblers.js
import db from './databaseCon.js'; 

export function getStumblers(rarity) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, name, rarity FROM stumblers`;
        let params = [];
        
        if (rarity) {
            sql += ` WHERE rarity = ?`;
            params.push(parseInt(rarity, 10));
        }
        
        sql += ` ORDER BY rarity ASC, name ASC`;
        
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}