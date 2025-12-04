// /src/pages/api/my-stumblers.js

import db from '../../utils/databaseCon.js'; 

export async function GET({ url }) {
    
    console.log('=== INICIO DEBUG ===');
    console.log('URL completa:', url.toString());
    console.log('URL.search:', url.search);
    
    const requestedRarity = url.searchParams.get('rarity');
    
    console.log('Parámetro rarity:', requestedRarity);
    console.log('Tipo:', typeof requestedRarity);
    
    let sql = `SELECT id, name, rarity FROM stumblers`;
    let params = [];
    
    if (requestedRarity) {
        const rarityNumber = parseInt(requestedRarity, 10);
        console.log('Convertido a número:', rarityNumber);
        
        if (!isNaN(rarityNumber)) {
            sql += ` WHERE rarity = ?`;
            params.push(rarityNumber);
            console.log('WHERE agregado');
        }
    } else {
        console.log('NO HAY PARÁMETRO RARITY');
    }
    
    sql += ` ORDER BY rarity ASC, name ASC`;
    
    console.log('SQL final:', sql);
    console.log('Params:', params);
    console.log('=== FIN DEBUG ===\n');

    try {
        const stumblers = await new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Rows obtenidas:', rows.length);
                    resolve(rows);
                }
            });
        });

        return new Response(
            JSON.stringify(stumblers), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

    } catch (error) {
        console.error("Error al obtener stumblers:", error.message);
        return new Response(
            JSON.stringify({ 
                error: 'Error al obtener datos', 
                details: error.message 
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export async function POST({ request }) {
    
    console.log('=== INICIO DEBUG POST ===');
    
    try {
        // 1. Leer el body de la petición
        const body = await request.json();
        const { name, rarity } = body;
        
        console.log('Body recibido:', body);
        console.log('Name:', name, 'Rarity:', rarity);
        
        // 2. Validar datos
        if (!name || name.trim() === '') {
            return new Response(
                JSON.stringify({ 
                    error: 'El nombre es requerido' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        if (rarity === undefined || rarity === null) {
            return new Response(
                JSON.stringify({ 
                    error: 'La rareza es requerida' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        const rarityNumber = parseInt(rarity, 10);
        if (isNaN(rarityNumber)) {
            return new Response(
                JSON.stringify({ 
                    error: 'La rareza debe ser un número' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        const nameTrimmed = name.trim().toUpperCase();
        
        // 3. Verificar si ya existe
        const exists = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM stumblers WHERE UPPER(name) = ?',
                [nameTrimmed],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
        
        if (exists) {
            console.log('Stumbler ya existe:', exists);
            return new Response(
                JSON.stringify({ 
                    error: 'Ya existe un stumbler con ese nombre',
                    existing: exists
                }), {
                    status: 409, // Conflict
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        
        // 4. Insertar el nuevo stumbler
        const result = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO stumblers (name, rarity) VALUES (?, ?)',
                [nameTrimmed, rarityNumber],
                function(err) {
                    if (err) reject(err);
                    else resolve({ 
                        id: this.lastID,
                        name: nameTrimmed,
                        rarity: rarityNumber
                    });
                }
            );
        });
        
        console.log('Stumbler creado:', result);
        console.log('=== FIN DEBUG POST ===\n');
        
        return new Response(
            JSON.stringify({
                message: 'Stumbler creado exitosamente',
                stumbler: result
            }), {
                status: 201, // Created
                headers: { 'Content-Type': 'application/json' },
            }
        );
        
    } catch (error) {
        console.error("Error al crear stumbler:", error.message);
        return new Response(
            JSON.stringify({ 
                error: 'Error al crear stumbler', 
                details: error.message 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}