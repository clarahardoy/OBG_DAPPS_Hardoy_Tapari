export const validateMonthYear = (month, year) => {
    if (month !== undefined && (month < 1 || month > 12)) {
        const error = new Error("El mes debe estar entre 1 y 12");
        error.status = 400;
        throw error;
    }
    if (year !== undefined && (year < 1900 || year > new Date().getFullYear())) {
        const error = new Error("El año debe estar entre 1900 y el año actual");
        error.status = 400;
        throw error;
    }
    return true;
}