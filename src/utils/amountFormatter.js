export const formatIndianAmount = (value) => {
    // Remove existing commas
    let rawValue = String(value ?? "").replace(/,/g, "");

    // Allow only numbers and decimal point
    if (!/^-?\d*\.?\d*$/.test(rawValue)) {
        return "";
    }

    if (rawValue === "") {
        return "";
    }

    const [integerPart, decimalPart] = rawValue.split(".");

    // Format Indian thousand separator
    let formattedValue = Number(integerPart || 0).toLocaleString("en-IN");

    // Keep decimal part as entered
    if (decimalPart !== undefined) {
        formattedValue += "." + decimalPart;
    }

    return formattedValue;
};