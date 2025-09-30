// Middleware para setear las fechas de lectura según el status
// Usado en create y update de Reading (con doc o con objeto de update)

export const setReadingDateMiddleware = (readingDocOrUpdate) => {
    const r = readingDocOrUpdate;

    // Tomamos el status de un doc o de un update
    const status = r.status || r.$set?.status;
    if (!status) return; // Si no hay status, no hacemos nada

    const now = new Date();

    // Función auxiliar:
    // Setea un campo de fecha si no existe ni en el doc ni en el $set del update
    const setIfUnset = (key) => {
        const hasDirect = r[key] !== undefined;
        const hasSet = r.$set?.[key] !== undefined;
        if (!hasDirect && !hasSet) {
            if (r.$set) r.$set[key] = now; else r[key] = now;
        };
    };

    // Asegura estructura $unset para updates y borra la propiedad
    const ensureUnsetBag = () => {
        if (!r.$unset) r.$unset = {};
    };

    // Función auxiliar: elimina un campo en el doc o update
    const unset = (key) => {
        if (r.$unset) r.$unset[key] = 1;
        else r[key] = undefined;
    };

    // Lógica según el status
    if (status === 'CURRENTLY_READING') {
        // Empieza a leer: aseguramos fecha de inicio
        setIfUnset('startedReading');
        // No tocar finishedReading si no corresponde
    };

    if (status === 'FINISHED') {
        // Aseguramos que ambas fechas estén puestas
        setIfUnset('startedReading');
        setIfUnset('finishedReading');
    };

    if (status === 'WANT_TO_READ') {
        // Todavía no empezó: limpiamos ambas fechas
        if (!r.$unset) r.$unset = {};
        unset('startedReading');
        unset('finishedReading');
    };

    if (status === 'ABANDONED') {
        // Abandonó: mantenemos started, limpiamos finished
        ensureUnsetBag();
        unset('finishedReading');
    };

    // mantener updatedAt
    if (r.$set) r.$set.updatedAt = now; else r.updatedAt = now;
};