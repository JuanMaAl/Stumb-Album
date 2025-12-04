// src/utils/postStumbler.js

/**
 * Crea un nuevo stumbler en la base de datos
 * @param {string} name - Nombre del stumbler
 * @param {number} rarity - Nivel de rareza del stumbler
 * @returns {Promise<Object>} El stumbler creado o un error
 */
export async function postStumbler(name, rarity) {
    try {
        const response = await fetch('/api/my-stumblers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                rarity
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error del servidor, lanzar excepción con el mensaje
            throw new Error(data.error || `Error HTTP: ${response.status}`);
        }

        return {
            success: true,
            data: data.stumbler,
            message: data.message
        };

    } catch (error) {
        console.error('Error al crear stumbler:', error);
        return {
            success: false,
            error: error.message
        };
    }
}