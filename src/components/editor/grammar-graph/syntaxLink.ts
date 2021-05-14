import { Log } from "../utils/log";
import { mergeMultiplyMode, MultiplyMode } from "./multiplyMode";
import { StatementType } from "./statementType";
import { SyntaxCollection } from "./syntaxCollection";

const identifierPrefix = "⟨⟨";
const identifierPostfix = "⟩⟩";
const alternativesPrefix = "{";
const alternativesPostfix = "}¹";
const optionalPrefix = "{";
const optionalPostfix = "}";
const zeromorePrefix = "{";
const zeromorePostfix = "}*";
const onemorePrefix = "{";
const onemorePostfix = "}+";

export class SyntaxLink {
    private _type: StatementType = StatementType.Unknown;
    private _chain: SyntaxLink[] = [];
    private _keywords: string[] = [];
    private _value = "";
    private _syntax = "";
    private _alternatives = false;
    private _multiplied: MultiplyMode = MultiplyMode.None;

    constructor(value?: string) {
        if (value) this._value = value;
    }

    add(entry: SyntaxLink) {
        this._chain.push(entry);
        if (this._alternatives || !this.hasKeyword()) this._keywords.push(...entry._keywords);
        this._type = StatementType.Block;
        this.constructSyntax();
    }

    addAll(entries: SyntaxLink[]) {
        entries.forEach(entry => this.add(entry));
    }

    collapse() {
        // Remove empty links
        this._chain = this._chain.filter(link => !link.isEmpty());
        // One alternative means this block doesn't contain alternatives
        if (this._alternatives && this._chain.length < 2) this._alternatives = false;
        // If there's only one sublink, elevate it
        if (this._chain.length === 1) this.overwrite(this._chain[0]);
        // If chain is empty, skip the rest
        if (this._chain.length === 0) return;
        // If there are child alternatives or children with keywords only, elevate them
        if (this._alternatives) {
            const added: SyntaxLink[] = [];
            const removed: SyntaxLink[] = [];
            this._chain.forEach(link => {
                if (link._alternatives) {
                    removed.push(link);
                    link._chain.forEach(sublink => {
                        sublink._multiplied = mergeMultiplyMode(sublink._multiplied, link._multiplied);
                        added.push(sublink);
                    });
                }
            });
            this._chain = this._chain.filter(link => !removed.includes(link));
            this._chain.push(...added);
        } else {
            if (this._chain[0].isAlternativeKeywords()) {
                this._alternatives = true;
                const link = this._chain.shift();
                const chain = this._chain;
                this._chain = [];
                if (link) {
                    link._chain.forEach(sublink => {
                        sublink._multiplied = mergeMultiplyMode(sublink._multiplied, link._multiplied);
                        const alternative = new SyntaxLink();
                        alternative.add(sublink);
                        alternative.addAll(chain);
                        alternative.collapse();
                        this._chain.push(alternative);
                    });
                }
            }
        }
        this.constructSyntax();
    }

    private overwrite(other: SyntaxLink) {
        this._chain = other._chain;
        this._keywords = other._keywords;
        this._alternatives = other._alternatives;
        this._syntax = other._syntax;
        this._value = other._value;
        this._multiplied = mergeMultiplyMode(this._multiplied, other._multiplied);
        this._type = other._type;
    }

    constructSyntax() {
        if (this.hasValue()) {
            this._syntax =
                this.multiplyPrefix() +
                (this.isType([StatementType.Rule, StatementType.Operand])
                    ? identifierPrefix + this._value + identifierPostfix
                    : this._value) +
                this.multiplyPostfix();
            if (this.hasChain()) Log.warn("Link with chain and value " + this._value, "SyntaxLink");
        } else {
            if (this._alternatives) {
                this._syntax =
                    (this.isMultiplied() ? this.multiplyPrefix() : alternativesPrefix) +
                    this._chain.map(link => link._syntax).join(" | ") +
                    (this.isMultiplied() ? this.multiplyPostfix() : alternativesPostfix);
            } else {
                this._syntax =
                    (this.isMultiplied() ? this.multiplyPrefix() : "") +
                    this._chain.map(link => link._syntax).join(" ") +
                    (this.isMultiplied() ? this.multiplyPostfix() : "");
            }
        }
    }

    private multiplyPrefix(): string {
        switch (this._multiplied) {
            case MultiplyMode.None:
                return "";
            case MultiplyMode.Optional:
                return optionalPrefix;
            case MultiplyMode.Onemore:
                return onemorePrefix;
            case MultiplyMode.Zeromore:
                return zeromorePrefix;
        }
    }

    private multiplyPostfix(): string {
        switch (this._multiplied) {
            case MultiplyMode.None:
                return "";
            case MultiplyMode.Optional:
                return optionalPostfix;
            case MultiplyMode.Onemore:
                return onemorePostfix;
            case MultiplyMode.Zeromore:
                return zeromorePostfix;
        }
    }

    contains(value: string) {
        return this._chain.some(entry => entry._value === value);
    }

    get alternatives(): boolean {
        return this._alternatives;
    }

    set alternatives(alternatives: boolean) {
        this._alternatives = alternatives;
    }

    get value(): string {
        return this._value;
    }

    get chain() {
        return this._chain;
    }

    set keyword(value: string) {
        this._value = value;
        this._keywords.push(this._value);
        this._type = StatementType.Keyword;
        this.constructSyntax();
    }

    set operator(value: string) {
        this._value = value;
        this._type = StatementType.Operator;
        this.constructSyntax();
    }

    set operand(value: string) {
        this._value = value.toLocaleLowerCase();
        this._type = StatementType.Operand;
        this.constructSyntax();
    }

    set rule(value: string) {
        this._value = value;
        this._type = StatementType.Rule;
        this.constructSyntax();
    }

    get syntax(): string {
        return this._syntax;
    }

    get multiplied(): MultiplyMode {
        return this._multiplied;
    }

    set multiplied(value: MultiplyMode) {
        this._multiplied = value;
    }

    get type(): StatementType {
        return this._type;
    }

    private isType(types: StatementType[]): boolean {
        return types.includes(this._type);
    }

    isAlternativeKeywords() {
        return (
            this._alternatives &&
            this.hasChain() &&
            this._chain.every(link => link.isType([StatementType.Keyword]))
        );
    }

    hasKeyword = (): boolean => this._keywords.length !== 0;
    hasChain = (): boolean => this._chain.length !== 0;
    hasValue = (): boolean => this._value !== "";
    isEmpty = (): boolean => !this.hasChain() && !this.hasValue();
    isMultiplied = (): boolean =>
        this._multiplied === MultiplyMode.Optional ||
        this._multiplied === MultiplyMode.Onemore ||
        this._multiplied === MultiplyMode.Zeromore;
    isOptional = (): boolean =>
        this._multiplied === MultiplyMode.Optional || this._multiplied === MultiplyMode.Zeromore;

    collectSyntax(keywords: SyntaxCollection) {
        keywords.createLevel(this.isOptional());
        if (!this._alternatives) {
            this._chain.forEach(link => {
                switch (link._type) {
                    case StatementType.Keyword: {
                        keywords.addKeyword(link._value, link._syntax, link._value, link.isOptional());
                        break;
                    }
                    case StatementType.Operator: {
                        if (link.isOptional()) {
                            keywords.append(link._syntax, "");
                        } else {
                            keywords.append(link._syntax, link._value);
                        }
                        break;
                    }
                    case StatementType.Operand: {
                        keywords.append(link._syntax, "");
                        break;
                    }
                    case StatementType.Rule: {
                        keywords.append(link._syntax, "");
                        break;
                    }
                    case StatementType.Block: {
                        link.collectSyntax(keywords);
                        break;
                    }
                    default: {
                        Log.warn("Unknown syntax link type", "SyntaxLink");
                        break;
                    }
                }
            });
        }
        keywords.terminateLevel();
    }

    /**
     * Removes erroneous optional flags added to tokens and statements during tokenizing process.
     */
    unOption() {
        this._multiplied = MultiplyMode.None;
        if (this._alternatives) {
            this._chain.forEach(link => link.unOption());
        } else {
            const link = this._chain[0];
            if (link) link.unOption();
        }
    }
}
