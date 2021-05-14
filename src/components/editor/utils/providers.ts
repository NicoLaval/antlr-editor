import * as EditorApi from "monaco-editor";
import { editor, Position } from "monaco-editor";
import { languages } from "monaco-editor/esm/vs/editor/editor.api";
import { GrammarGraph } from "../grammar-graph/grammarGraph";
import { createLexer, createParser } from "./ParserFacade";
import { TokensProvider } from "./tokensProvider";
import { VocabularyPack } from "./vocabularyPack";
import { VARIABLE } from "./constants";
import { CustomTools, Variable } from "../../../model";

export const getTheme = (): EditorApi.editor.IStandaloneThemeData => {
    return {
        base: "vs",
        inherit: true,
        rules: [
            { token: "string", foreground: "018B03" },
            { token: "comment", foreground: "939393" },
            { token: "operator", foreground: "8B3301" },
            { token: "delimiter.bracket", foreground: "8B3301" },
            { token: "operator.special", foreground: "8B3301", fontStyle: "bold" },
        ],
        colors: {},
    };
};

export const getBracketsConfiguration = (): languages.LanguageConfiguration => {
    return {
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "(", close: ")" },
            { open: "[", close: "]" },
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "(", close: ")" },
            { open: "[", close: "]" },
        ],
        brackets: [
            ["{", "}"],
            ["(", ")"],
            ["[", "]"],
        ],
    };
};

export const getEditorWillMount = (tools: CustomTools) => (variables: Variable[]) => {
    const tokensProvider: TokensProvider = new TokensProvider(tools);
    const { id } = tools;
    return (monaco: typeof EditorApi) => {
        monaco.languages.register({ id });
        monaco.languages.setMonarchTokensProvider(id, tokensProvider.monarchLanguage());
        monaco.editor.defineTheme(id.replace(".", "-"), getTheme());
        monaco.languages.setLanguageConfiguration(id, getBracketsConfiguration());
        monaco.languages.registerCompletionItemProvider(id, {
            provideCompletionItems: getSuggestions(tools, monaco, variables),
        });
    };
};

const buildGrammarGraph = (tools: CustomTools) => {
    const { lexer: Lexer, parser: Parser, grammar } = tools;
    const lexer = createLexer(Lexer)("");
    const parser = createParser({ Lexer, Parser })("");
    const vocabulary: VocabularyPack<typeof lexer, typeof parser> = new VocabularyPack(lexer, parser);
    const grammarGraph: GrammarGraph<typeof lexer, typeof parser> = new GrammarGraph(
        vocabulary,
        grammar,
    );
    return grammarGraph;
};

const getSuggestions = (tools: CustomTools, monaco: typeof EditorApi, variables: Variable[]): any => {
    return function (model: editor.ITextModel, position: Position) {
        const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
        });
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };

        let uniquetext = Array.from(
            new Set(
                textUntilPosition
                    .replace(/"(.*?)"/g, "")
                    .replace(/[^a-zA-Z_]/g, " ")
                    .split(" ")
                    .filter(w => w !== ""),
            ).values(),
        );
        buildGrammarGraph(tools);
        const { getSuggestionsFromRange } = tools;
        const grammarSuggestions = getSuggestionsFromRange(range);
        const suggestionList: languages.CompletionItem[] =
            grammarSuggestions.length !== 0
                ? grammarSuggestions
                : buildGrammarGraph(tools).suggestions();
        uniquetext = removeLanguageSyntaxFromList(uniquetext, suggestionList);
        const array = uniquetext.map(w => {
            return {
                label: w,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: w,
            } as languages.CompletionItem;
        });
        const vars = variables.map(({ label, name }) => ({
            label,
            kind: VARIABLE,
            insertText: name,
            range,
        }));
        return {
            suggestions: [...suggestionList, ...array, ...vars],
        };
    };

    function removeLanguageSyntaxFromList(vars: string[], suggestionList: any[]) {
        const suggestionsLabels = suggestionList.map(s => s.label.toLowerCase());
        return vars.filter(t => !suggestionsLabels.includes(t.toLowerCase()));
    }
};
