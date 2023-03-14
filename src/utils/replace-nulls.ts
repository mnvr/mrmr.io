// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable no-proto

// Source:
// https://github.com/apollographql/apollo-client/issues/2412#issuecomment-755449680

type RecursivelyReplaceNullWithUndefined<T> = T extends null
    ? undefined
    : T extends Date
    ? T
    : {
          [K in keyof T]: T[K] extends (infer U)[]
              ? RecursivelyReplaceNullWithUndefined<U>[]
              : RecursivelyReplaceNullWithUndefined<T[K]>;
      };

/**
 * Recursively replaces all `null`s with `undefined`s.
 *
 * Skips object classes (that have a `.__proto__.constructor`).
 *
 * If nulls were a billion dollar mistake, Javascript made two of them.
 */
export const replaceNullsWithUndefineds = <T>(
    obj: T
): RecursivelyReplaceNullWithUndefined<T> => {
    const newObj: any = {};
    Object.keys(obj as any).forEach((k) => {
        const v: any = (obj as any)[k];
        newObj[k as keyof T] =
            v === null
                ? undefined
                : v &&
                  typeof v === "object" &&
                  v.__proto__.constructor === Object
                ? replaceNullsWithUndefineds(v)
                : v;
    });
    return newObj;
};
