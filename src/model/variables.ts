export enum VariableType {
    STRING = "STRING",
    INTEGER = "INTEGER",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
}

export enum VariableRole {
    IDENTIFIER = "IDENTIFIER",
    MEASURE = "MEASURE",
    DIMENSION = "DIMENSION",
}

export interface Variable {
    type: VariableType;
    role: VariableRole;
    name?: string;
    label?: string;
}

export interface Variables {
    [name: string]: Variable;
}
