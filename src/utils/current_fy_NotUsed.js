export async function getFinancialYear() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // January = 1

    if (month >= 4) {
      // April to December
      return `${year}-${String(year + 1).slice(-2)}`;
    } else {
      // January to March
      return `${year - 1}-${String(year).slice(-2)}`;
    }
}