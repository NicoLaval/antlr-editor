import { MultiplyMode } from "./multiplyMode";
import { TokenType } from "./tokenType";

export class RuleToken {
    public type: TokenType;
    public name: string | undefined;
    public value: string | undefined;
    public identifier: string | undefined;
    public nested = 0;
    public multiplied: MultiplyMode = MultiplyMode.None;
    public greedy = true;
    public sibling: RuleToken | undefined;

    constructor(type: TokenType, nested?: number, name?: string, value?: string) {
        this.type = type;
        if (nested) this.nested = nested;
        if (name) this.name = name;
        if (value) this.value = value;
    }

    multiply(type: string) {
        let multiplied;
        switch (type) {
            case TokenType.Question:
                multiplied = MultiplyMode.Optional;
                break;
            case TokenType.Plus:
                multiplied = MultiplyMode.Onemore;
                break;
            case TokenType.Star:
                multiplied = MultiplyMode.Zeromore;
                break;
            default:
                return;
        }
        if (this.multiplied === multiplied) return;
        this.multiplied = this.multiplied === MultiplyMode.None ? multiplied : MultiplyMode.Zeromore;
    }

    label(identifier: string | undefined) {
        this.identifier = identifier;
    }

    isAssign() {
        return this.type === TokenType.Assign || this.type === TokenType.PlusAssign;
    }

    isAtom() {
        return (
            this.type === TokenType.Keyword ||
            this.type === TokenType.Operator ||
            this.type === TokenType.Operand ||
            this.type === TokenType.Rule ||
            this.type === TokenType.Unknown
        );
    }
}
