export function getCountryAbbr(country: string): string {
    const normalized = country
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase();

    return normalized.slice(0, 3);
}
