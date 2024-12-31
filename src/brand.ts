const brand = Symbol("brand");

export type Brand<T, U> = T & {
    [brand]: U;
};

export type RemoveBrand<T> = T[Exclude<keyof T, typeof brand>];
