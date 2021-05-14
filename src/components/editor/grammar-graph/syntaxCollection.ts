import { IMarkdownString, languages } from "monaco-editor";

export class SyntaxCollection {
    entries: SyntaxEntry[] = [];
    private _levels: SyntaxLevel[] = [];
    terminated = false;

    addAll(entries: SyntaxEntry[]) {
        this.entries.push(...entries);
    }

    isEmpty = () => this.entries.length === 0;
    notEmpty = (): boolean => this.entries.length !== 0;
    size = () => this.entries.length;

    createLevel(optional: boolean) {
        const level = new SyntaxLevel(optional);
        this._levels.unshift(level);
        return level;
    }

    terminateLevel() {
        const level = this._levels.shift();
        if (level) {
            level.terminate();
            this.entries.push(...level.entries);
        }
    }

    addKeyword(keyword: string, syntax: string, snippet: string, optional: boolean) {
        const lastLevel = this._levels[0];
        if (!lastLevel) return;
        for (const level of this._levels) {
            if (optional) {
                level.append("", syntax, "");
            } else {
                level.append(keyword, syntax, snippet);
            }
            if (level.optional) break;
        }
        const entry = new SyntaxEntry(keyword);
        if (optional) entry.terminate();
        lastLevel.add(entry);
    }

    append(syntax: string, snippet: string) {
        for (const level of this._levels) {
            level.append("", syntax, snippet);
            if (level.optional) break;
        }
    }

    distinct() {
        const distinct = new Map<string, SyntaxEntry[]>();
        const entries: SyntaxEntry[] = [];
        this.entries.forEach(entry => {
            let subentries: SyntaxEntry[] | undefined = distinct.get(entry.keyword);
            if (subentries) {
                if (!subentries.some(subentry => subentry.equals(entry))) {
                    subentries.push(entry);
                    entries.push(entry);
                }
            } else {
                subentries = [];
                subentries.push(entry);
                distinct.set(entry.keyword, subentries);
                entries.push(entry);
            }
        });
        this.entries = entries;
    }
}

export class SyntaxLevel {
    entries: SyntaxEntry[] = [];
    optional = false;

    constructor(optional: boolean) {
        this.optional = optional;
    }

    add(entry: SyntaxEntry) {
        this.entries.push(entry);
    }

    append(keyword: string, syntax: string, snippet: string) {
        this.entries.forEach(entry => {
            entry.append(keyword, syntax, snippet);
        });
    }

    terminate() {
        this.entries.forEach(entry => entry.terminate());
    }
}

export class SyntaxEntry {
    private _keyword: string;
    private _syntax: string;
    private _snippet: string;
    private _markdown: IMarkdownString = { value: "" };
    private _terminated = false;
    private _kind = languages.CompletionItemKind.Keyword;
    private round = false;
    private openRound = 0;
    private square = false;
    private openSquare = 0;
    private curly = false;
    private openCurly = 0;
    private angle = false;
    private openAngle = 0;

    constructor(keyword: string) {
        this._keyword = keyword;
        this._syntax = keyword;
        this._snippet = keyword;
    }

    terminate(): void {
        this._terminated = true;
    }

    get keyword(): string {
        return this._keyword;
    }

    get syntax(): string {
        return this._syntax;
    }

    get markdown(): IMarkdownString {
        return this._markdown;
    }

    get snippet(): string {
        return this._snippet;
    }

    get terminated(): boolean {
        return this._terminated;
    }

    append(keyword: string, syntax: string, snippet: string) {
        if (this._terminated) return;
        if (this._keyword === this._syntax && keyword !== "") {
            this._keyword = this._keyword + " " + keyword;
        }

        switch (syntax) {
            case "(": {
                this.round = true;
                this.openRound++;
                this._syntax = this._syntax + " " + syntax;
                this._snippet = this._snippet + " " + snippet;
                break;
            }
            case ")": {
                if (this.round && this.openRound > 0) {
                    this.openRound--;
                    this.round = this.openRound > 0;
                    this._syntax = this._syntax + " " + syntax;
                    this._snippet = this._snippet + " " + snippet;
                } else {
                    this.terminate();
                }
                break;
            }
            case "[": {
                this.square = true;
                this.openSquare++;
                this._syntax = this._syntax + " " + syntax;
                this._snippet = this._snippet + " " + snippet;
                break;
            }
            case "]": {
                if (this.square && this.openSquare > 0) {
                    this.openSquare--;
                    this.square = this.openSquare > 0;
                    this._syntax = this._syntax + " " + syntax;
                    this._snippet = this._snippet + " " + snippet;
                } else {
                    this.terminate();
                }
                break;
            }
            case "{": {
                this.curly = true;
                this.openCurly++;
                this._syntax = this._syntax + " " + syntax;
                this._snippet = this._snippet + " " + snippet;
                break;
            }
            case "}": {
                if (this.curly && this.openCurly > 0) {
                    this.openCurly--;
                    this.curly = this.openCurly > 0;
                    this._syntax = this._syntax + " " + syntax;
                    this._snippet = this._snippet + " " + snippet;
                } else {
                    this.terminate();
                }
                break;
            }
            case "<": {
                this.angle = true;
                this.openAngle++;
                this._syntax = this._syntax + " " + syntax;
                this._snippet = this._snippet + " " + snippet;
                break;
            }
            case ">": {
                if (this.angle && this.openAngle > 0) {
                    this.openAngle--;
                    this.angle = this.openAngle > 0;
                    this._syntax = this._syntax + " " + syntax;
                    this._snippet = this._snippet + " " + snippet;
                } else {
                    this.terminate();
                }
                break;
            }
            default: {
                this._syntax = this._syntax + (syntax !== "" ? " " + syntax : "");
                this._snippet = this._snippet + (snippet !== "" ? " " + snippet : "");
            }
        }
    }

    equals(entry: SyntaxEntry) {
        return (
            this._keyword === entry._keyword &&
            this._syntax === entry._syntax &&
            this._snippet === entry._snippet &&
            this._terminated === entry._terminated
        );
    }

    completionKind() {
        return this._kind;
    }
}
