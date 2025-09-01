export function calculateValidity(durationMonths: number, start: Date): Date {
    const validity = new Date(start);
    validity.setMonth(validity.getMonth() + durationMonths);
    return validity
}