/**
 * Safely increment an integer counter, taking into account overflowing the maximum safe value.
 * <p>
 * Obviously the chances for an overflow occurring on a simple counter are essentially zero, but it does no harm to
 * check for it.
 *
 * @param val starting value
 * @returns increment value, or 0 if the increment would cause an overflow
 */
export const increment = (val: number) => (Number.isSafeInteger(val + 1) ? val + 1 : 0)
