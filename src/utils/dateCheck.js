export const isDateBetween = (date, startDate, endDate) => {
    const parseDate = (value) => {
        const [day, month, year] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const selected = parseDate(date);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    return selected >= start && selected <= end;
};