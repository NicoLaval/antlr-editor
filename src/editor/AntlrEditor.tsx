import { useState } from "react";
import * as EditorApi from "monaco-editor/esm/vs/editor/editor.api";
import { Position } from "monaco-editor";
import EditorLib from "./editor";
import monarchDefinition from "./monarch.json";
import { getSuggestionsFromRange } from "./grammar/json/suggestions";

export type AntlrEditorProps = {
    script: string;
    setScript: (value: string) => void;
    setScriptChanged?: (value: boolean) => void;
    theme?: string;
    languageVersion: string;
    setErrors: (array: EditorApi.editor.IMarkerData[]) => void;
    suggesterURL: string[];
    tools: any;
};

export default function AntlrEditor(props: AntlrEditorProps) {
    const {
        script,
        setScript,
        setScriptChanged = () => false,
        theme = "vs-dark",
        languageVersion,
        setErrors,
        suggesterURL,
        tools,
    } = props;

    const setCursorPosition = useState(new Position(0, 0))[1];
    const [tempCursor] = useState(new Position(0, 0));

    const { id = "default-id", Lexer: lexer, Parser: parser, grammar, initialRule } = tools;

    const fullTools = {
        id,
        monarchDefinition,
        lexer,
        parser,
        grammar,
        initialRule,
        getSuggestionsFromRange,
    };

    return (
        <EditorLib
            tools={fullTools}
            resizeLayout={[false, true, 100]}
            script={script}
            setScript={setScript}
            setScriptChanged={setScriptChanged}
            theme={theme}
            languageVersion={languageVersion}
            setCursorPosition={setCursorPosition}
            tempCursor={tempCursor}
            setErrors={setErrors}
            // TODO: enable several dataset suggestions
            suggesterURL={suggesterURL}
        />
    );
}
