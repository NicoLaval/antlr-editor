import { Variables } from "../../../model";

export const buildVariables = (variables: Variables) =>
    Object.entries(variables).map(([name, { type, role }]) => ({
        name,
        type,
        role,
        label: `${name.toUpperCase()} (${type})`,
    }));

// TODO: really need to check unicity?
export const buildUniqueVariables = (variables: any[]) =>
    variables
        .reduce((acc, a) => [...acc, ...a], [])
        .map((v: any) => ({ ...v, label: `${v.name.toUpperCase()}${v.type ? ` (${v.type})` : ""}` }));
