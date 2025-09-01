export function calculateValidity(durationMonths: number, start?: string): Date {
    const validity = new Date(start || Date.now());
    validity.setMonth(validity.getMonth() + durationMonths);
    return validity
}