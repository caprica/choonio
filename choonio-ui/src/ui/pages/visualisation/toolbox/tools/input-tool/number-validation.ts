export const validateNumber = (value: number, min?: number, max?: number): boolean => {
    if (min && value < min) return false
    if (max && value > max) return false
    return true
}
