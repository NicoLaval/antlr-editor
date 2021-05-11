import { Lexer, Parser } from "antlr4ts";
import { Log } from "../utils/log";
import { VocabularyPack } from "../utils/vocabularyPack";
import { RuleToken } from "./ruleToken";
import { TokenizerContext } from "./tokenizerContext";
import { TokenType } from "./tokenType";

export const rgxEscape = /[-/\\^$*+?.()|[\]{}]/g;
export const rgxReplace = "\\$&";

export class RuleTokenizer<L extends Lexer, P extends Parser> {
    private vocabulary: VocabularyPack<L, P>;
    private readonly context: TokenizerContext = {
        tokens: [],
        parens: [],
        atom: [],
        modifier: undefined,
    };

    constructor(vocabulary: VocabularyPack<L, P>) {
        this.vocabulary = vocabulary;
    }

    public tokenize(declaration: string): RuleToken[] {
        this.clearContext();
        Array.from(declaration).forEach((value, index) => {
            if (!(this.isAtom(value, index) || this.isModifier(value, index))) {
                switch (value) {
                    case TokenType.Lparen: {
                        const token = new RuleToken(TokenType.Lparen, this.context.parens.length);
                        this.context.parens.push(token);
                        this.context.tokens.push(token);
                        break;
                    }
                    case TokenType.Rparen: {
                        const lparen = this.context.parens.pop();
                        if (lparen) {
                            const lindex = this.context.tokens.indexOf(lparen);
                            if (lindex !== this.context.tokens.length - 2) {
                                const rparen = new RuleToken(
                                    TokenType.Rparen,
                                    this.context.parens.length,
                                );
                                lparen.sibling = rparen;
                                rparen.sibling = lparen;
                                this.context.tokens.push(rparen);
                            } else {
                                const last = this.lastToken();
                                if (last) last.nested--;
                                this.context.tokens.splice(lindex, 1);
                            }
                        } else this.unexpected(value, index);
                        break;
                    }
                    case TokenType.Pipe: {
                        this.addToken(value);
                        break;
                    }
                    case TokenType.Assign: {
                        const last = this.lastToken([TokenType.Unknown]);
                        if (last) {
                            last.type = TokenType.Identifier;
                            this.addToken(value);
                            Log.warn(
                                "Unknown operator token " + last.name + " recognized as identifier",
                                "RuleTokenizer",
                            );
                        }
                        break;
                    }
                    case TokenType.Hash: {
                        this.addToken(value);
                        break;
                    }
                    case TokenType.Space: {
                        this.finishAtom(index);
                        break;
                    }
                    default: {
                        this.unexpected(value, index);
                    }
                }
            }
        });
        this.finishAtom(declaration.length);
        return this.context.tokens;
    }

    private isAtom(value: string, index: number): boolean {
        if (/[a-zA-Z_0-9]/.test(value)) {
            this.context.atom.push(value);
            return true;
        }
        this.finishAtom(index);
        return false;
    }

    private isModifier(value: string, index: number): boolean {
        // TODO: add plus assign and multipliers stacking
        if (/[*+?]/.test(value)) {
            const last = this.lastToken([
                TokenType.Keyword,
                TokenType.Operator,
                TokenType.Operand,
                TokenType.Rule,
                TokenType.Rparen,
                TokenType.Unknown,
            ]);
            if (this.context.modifier) {
                if (value === TokenType.Question && last) last.greedy = false;
                else this.unexpected(value, index);
                this.finishModifier();
            } else {
                if (last) {
                    last.multiply(value);
                    this.context.modifier = value as any;
                } else this.unexpected(value, index);
            }
            return true;
        }
        this.finishModifier();
        return false;
    }

    private addToken(type: TokenType) {
        this.context.tokens.push(new RuleToken(type, this.context.parens.length));
    }

    private finishAtom(index: number) {
        if (this.context.atom.length > 0) {
            const name: string = this.context.atom.join("");
            let value: string | undefined = undefined;
            index = index - this.context.atom.length;
            const last = this.lastToken([TokenType.Hash]);
            let type: TokenType;
            if (last) {
                type = TokenType.Label;
            } else if (this.vocabulary.isSymbolicName(name)) {
                type = TokenType.Operand;
                const symbolicIndex = this.vocabulary.symbolicIndex(name);
                if (this.vocabulary.hasKeyword(symbolicIndex)) {
                    type = TokenType.Keyword;
                    value = this.vocabulary.keyword(symbolicIndex);
                } else if (this.vocabulary.hasOperator(symbolicIndex)) {
                    type = TokenType.Operator;
                    value = this.vocabulary.operator(symbolicIndex);
                }
            } else if (name in Lexer) {
                type = TokenType.Operator;
            } else if (this.vocabulary.isRuleName(name)) {
                type = TokenType.Rule;
            } else {
                type = TokenType.Unknown;
                Log.warn("Unknown operator token " + name + " at " + index, "RuleTokenizer");
            }

            this.context.tokens.push(new RuleToken(type, this.context.parens.length, name, value));
            this.context.atom.length = 0;
        }
    }

    private finishModifier() {
        this.context.modifier = undefined;
    }

    private unexpected(token: string, index: number) {
        Log.error("Unexpected token " + token + " at " + index, "RuleTokenizer");
    }

    private clearContext() {
        this.context.tokens = [];
        this.context.parens = [];
        this.context.atom = [];
        this.context.modifier = undefined;
    }

    private lastToken(filter?: TokenType[]): RuleToken | undefined {
        if (this.context.tokens.length > 0) {
            const last = this.context.tokens[this.context.tokens.length - 1];
            if (last && (!filter || filter.includes(last.type))) return last;
        }
        return undefined;
    }

    public ruleName(declaration: string, index: number): string {
        const ruleNames = this.vocabulary.getRuleNames();
        if (!ruleNames[index]) return declaration;
        let rgx = new RegExp(ruleNames[index].replace(rgxEscape, rgxReplace), "g");
        if (rgx.test(declaration)) {
            return ruleNames[index];
        } else {
            Log.warn("Mismatched rule " + index + " name. Looking for alternatives.", "RuleTokenizer");
            ruleNames.forEach((ruleName, other) => {
                rgx = new RegExp(ruleName.replace(rgxEscape, rgxReplace), "g");
                if (rgx.test(declaration)) {
                    Log.warn("Matched name of rule " + other + ".", "RuleTokenizer");
                    return ruleName;
                }
            });
            Log.error("No alternative for mismatched rule name.", "RuleTokenizer");
        }
        return declaration;
    }

    public static alternatives(tokens: RuleToken[]): RuleToken[][] {
        let pipeIndex = -1;
        let statement: RuleToken[] = [];
        return tokens.reduce((statements: RuleToken[][], token, index, initial) => {
            if (token.nested === 0 && token.type === TokenType.Pipe) {
                statement = initial.slice(pipeIndex + 1, index);
                if (statement.length !== 0) statements.push(statement);
                pipeIndex = index;
            } else if (index === initial.length - 1) {
                statement = initial.slice(pipeIndex + 1);
                if (statement.length !== 0) statements.push(statement);
            }
            return statements;
        }, []);
    }

    public static parentheses(tokens: RuleToken[]): RuleToken[][] {
        let parenIndex = -1;
        let statement: RuleToken[] = [];
        return tokens.reduce((statements: RuleToken[][], token, index, initial) => {
            if (
                token.nested === 0 &&
                (token.type === TokenType.Lparen || token.type === TokenType.Rparen)
            ) {
                statement = initial.slice(parenIndex, index + (token.type === TokenType.Rparen ? 1 : 0));
                if (statement.length !== 0) statements.push(statement);
                parenIndex = index;
            } else if (index === initial.length - 1) {
                statement = initial.slice(parenIndex + 1);
                if (statement.length !== 0) statements.push(statement);
            }
            return statements;
        }, []);
    }

    static unnest(tokens: RuleToken[]) {
        if (!tokens) return [];
        const left = tokens[0];
        const right = tokens[tokens.length - 1];
        if (
            left.type === TokenType.Lparen &&
            right.type === TokenType.Rparen &&
            left.sibling === right
        ) {
            tokens.pop();
            tokens.shift();
            tokens.forEach(token => token.nested--);
        }
        return tokens;
    }
}
