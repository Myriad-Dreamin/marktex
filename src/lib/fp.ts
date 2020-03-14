export type functor<I> = (i: I) => I;
export const compose = <I>(g: functor<I>, f: functor<I>) => (i: I) => g(f(i));

export type Nothing = undefined;
export type Maybe<I> = I | Nothing;

export function Id<I>(i: I) {
    return i;
}

export type MaybeF<I> = (i: I) => Maybe<I>;

// maybeCompose = MaybeF
export function maybeCompose<I>(...fns: any) {
    return (fns.length == 0) ? Id : (fns.length == 1 ? fns[0] : function (i: I) {
        let j: I | undefined = fns[fns.length - 1](i);
        for (let k = fns.length - 2; k >= 0; k--) {
            if (j === undefined) {
                return undefined;
            }
            j = fns[k](j);
        }
        return j;
    });
}