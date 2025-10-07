export const validateMonthYear = (month, year) => {
    if (month < 1 || month > 12) {
        throw new Error("El mes debe estar entre 1 y 12", { status: 400 });
    }
    if (year < 1900 || year > new Date().getFullYear()) {
        throw new Error("El año debe estar entre 1900 y el año actual", { status: 400 });
    }
    return true;
}