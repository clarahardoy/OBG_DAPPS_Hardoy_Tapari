export const buildRange = ({ year, month }) => {
    if (!year && !month) return null;
    const y = year ?? new Date().getFullYear();
    if (month) {
        const start = new Date(y, month - 1, 1);
        const end = new Date(y, month, 1);
        return { start, end };
    };

    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    return { start, end };
};
