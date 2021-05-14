import { Lexer, Parser } from "antlr4ts";
import { languages } from "monaco-editor";
import { VocabularyPack } from "../utils/vocabularyPack";
import { GrammarStatement } from "./grammarStatement";
import { RuleToken } from "./ruleToken";
import { rgxEscape, rgxReplace, RuleTokenizer } from "./ruleTokenizer";
import { StatementType } from "./statementType";
import { SyntaxCollection } from "./syntaxCollection";

export class GrammarGraph<L extends Lexer, P extends Parser> {
    private vocabulary: VocabularyPack<L, P>;
    private readonly tokenizer: RuleTokenizer<L, P>;
    private readonly rules: Map<string, GrammarStatement> = new Map<string, GrammarStatement>();
    private readonly operators: Map<string, GrammarStatement> = new Map<string, GrammarStatement>();
    private readonly keywords: SyntaxCollection = new SyntaxCollection();
    private root: GrammarStatement | undefined;

    constructor(vocabulary: VocabularyPack<L, P>, grammar: string) {
        this.vocabulary = vocabulary;
        this.tokenizer = new RuleTokenizer(vocabulary);
        if (grammar && grammar.length > 0) this.processRaw(grammar);
    }

    private processRaw(grammar: string) {
        // Strip import wrapping, comments, newlines and tabulators
        let processed = grammar.replace(/^export default "|\/\*.*?\*\/|(\\[rnt])+|";$/g, " ");

        // Replace literal tokens with names from vocabulary
        this.vocabulary.getLiteralNames().forEach((literal, index) => {
            const symbolic = this.vocabulary.symbolicName(index);
            if (!!literal && processed.includes(literal)) {
                // Escape all RegExp special characters first
                processed = processed.replace(
                    new RegExp(literal.replace(rgxEscape, rgxReplace), "g"),
                    " " + symbolic + " ",
                );
            }
        });

        // Split grammar into rules
        processed
            .split(";")
            .filter(value => value.includes(":"))
            .forEach((value, index) => {
                let colon = value.indexOf(":");
                const name = this.tokenizer.ruleName(value.substr(0, colon).trim(), index);
                const tokens = this.tokenizer.tokenize(
                    value
                        .substr(++colon)
                        .trim()
                        .replace(/ +/g, " "),
                );
                this.addRule(name, tokens);
            });

        // Resolve remaining statements and collect operators
        this.rules.forEach(rule =>
            rule.resolveStatements(this.rules, this.operators, new Map<string, GrammarStatement>()),
        );

        // Resolve syntax of functions and operators
        this.rules.forEach(rule => rule.resolveSyntax(this.keywords));
        this.keywords.distinct();

        // Find root
        const rule0 = this.vocabulary.ruleName(0);
        if (rule0) this.root = this.rules.get(rule0);
    }

    private addRule(name: string, tokens: RuleToken[]): GrammarStatement {
        const rule = new GrammarStatement(StatementType.Rule, tokens, name);
        this.rules.set(name, rule);
        rule.processRule();
        return rule;
    }

    rootName() {
        return !!this.root ? this.root.name : undefined;
    }

    suggestions(): languages.CompletionItem[] {
        return this.keywords.entries.map(entry => {
            return {
                label: entry.keyword,
                kind: entry.completionKind(),
                insertText: entry.snippet,
                detail: entry.syntax,
                documentation: "",
            } as languages.CompletionItem;
        });
    }
}
