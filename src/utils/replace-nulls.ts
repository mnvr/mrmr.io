// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable no-proto

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
    ? undefined
    : T extends Date
      ? T
      : T extends Array<infer U>
        ? RecursivelyReplaceNullWithUndefined<U>[]
        : {
              [K in keyof T]: T[K] extends (infer U)[]
                  ? RecursivelyReplaceNullWithUndefined<U>[]
                  : RecursivelyReplaceNullWithUndefined<T[K]>;
          };

/**
 * Recursively replaces all `null`s with `undefined`s.
 *
 * Skips object classes (that have a `.__proto__.constructor`), but handles
 * arrays.
 *
 * If nulls were a billion dollar mistake, Javascript made two of them.
 *
 * History:
 *
 * - Original taken from this really helpful comment in this (now locked) thread
 *   requesting Apollo to not continue making our lives harder:
 *   https://github.com/apollographql/apollo-client/issues/2412#issuecomment-755449680
 *
 * - Modified to handle arrays (I think correctly, but I can't be sure).
 *
 * Example test case:
 *
 *     const to = {
 *         a: 3,
 *         b: null,
 *         c: [3, 4, null, { d: "e", f: null }],
 *     };
 *     console.log(replaceNullsWithUndefineds(to));
 *
 * Prints:
 *
 *     {
 *         a: 3,
 *         b: undefined,
 *         c: [ 3, 4, undefined, { d: 'e', f: undefined } ]
 *     }
 */
export const replaceNullsWithUndefineds = <T>(
    obj: T,
): RecursivelyReplaceNullWithUndefined<T> => {
    const replace = (v: any) =>
        v === null
            ? undefined
            : v && typeof v === "object" && v.__proto__.constructor === Object
              ? replaceNullsWithUndefineds(v)
              : Array.isArray(v)
                ? replaceNullsWithUndefineds(v)
                : v;
    if (Array.isArray(obj)) {
        const newArr: any = [];
        obj.forEach((v) => {
            newArr.push(replace(v));
        });
        return newArr;
    } else {
        const newObj: any = {};
        Object.keys(obj as any).forEach((k) => {
            const v: any = (obj as any)[k];
            newObj[k as keyof T] = replace(v);
        });
        return newObj;
    }
};
