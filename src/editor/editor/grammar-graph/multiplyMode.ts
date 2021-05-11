export enum MultiplyMode {
    None,
    Optional,
    Onemore,
    Zeromore,
}

export function mergeMultiplyMode(first: MultiplyMode, second: MultiplyMode): MultiplyMode {
    if (first !== second && second !== MultiplyMode.None) {
        return first === MultiplyMode.None ? second : MultiplyMode.Zeromore;
    }
    return first;
}
