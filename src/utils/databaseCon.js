// /src/utils/databaseCon.js (Usando ES Modules)

// 1. Usa la sintaxis 'import' para módulos
import sqlite3 from 'sqlite3';

// Necesitas la clase Database
const { Database } = sqlite3.verbose();

// Nombre y ubicación de tu archivo de base de datos
const DB_FILE = 'data-base/mis-stumblers.db';

// Crea una nueva conexión a la base de datos
const db = new Database(DB_FILE, (err) => { // <-- Nota: Usamos 'Database' aquí
    if (err) {
        console.error(`❌ Error al conectar con la base de datos ${DB_FILE}:`, err.message);
    } else {
        console.log(`✅ Conectado exitosamente a la base de datos SQLite: ${DB_FILE}`);
    }
});

// Exporta el objeto de conexión
export default db; // <-- Usamos export default