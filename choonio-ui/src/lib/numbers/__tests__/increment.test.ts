import { increment } from '../increment'

it('increments value', () => {
    expect(increment(0)).toBe(1)
    expect(increment(1)).toBe(2)
    expect(increment(Number.MAX_SAFE_INTEGER - 1)).toBe(Number.MAX_SAFE_INTEGER)
})

it('wraps value when incrementing past maximum', () => {
    expect(increment(Number.MAX_SAFE_INTEGER)).toBe(0)
})
