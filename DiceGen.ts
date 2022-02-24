type PrependNextNum<A extends unknown[]> = A["length"] extends infer T
    ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
        ? X
        : never
    : never

type EnumerateInternal<A extends unknown[], N extends number> = {
    0: A
    1: EnumerateInternal<PrependNextNum<A>, N>
}[N extends A["length"] ? 0 : 1]

type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never

type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>

type NumberAsArray = [...unknown[]]
type Zero = []
type ArrayToNumber<N extends NumberAsArray> = N["length"]
type NumberToArray<I extends number, N extends NumberAsArray = Zero> = I extends ArrayToNumber<N> ? N : NumberToArray<I, Succ<N>>
type Succ<N extends NumberAsArray> = [...N, unknown]
type Inc<N extends NumberAsArray> = [...N, unknown]

function d<T extends number>(dieSize: T, rng: () => number = Math.random) {
    return {
        roll: () => {
            const seed = rng()
            if (seed >= 1 || seed < 0) throw new Error("rng generates numbers outside of the range [0,1)")
            return (Math.floor(seed * dieSize) + 1) as Range<1, ArrayToNumber<Inc<NumberToArray<T>>>>
        },
    }
}

const DieWith91Sides = d(91)
DieWith91Sides.roll() // 1 or 2 or 3 or 4 .... to 91 inclusive
