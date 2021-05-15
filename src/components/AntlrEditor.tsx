import { useState } from "react";
import * as EditorApi from "monaco-editor/esm/vs/editor/editor.api";
import { Position } from "monaco-editor";
import Editor from "./editor";
import monarchDefinition from "./monarch.json";
import { Tools, Variables } from "../model";
import { getDefaultSuggestionsFromRange } from "./default-suggestions";

export type AntlrEditorProps = {
    script: string;
    setScript: (value: string) => void;
    setScriptChanged?: (value: boolean) => void;
    theme?: string;
    languageVersion: string;
    setErrors: (array: EditorApi.editor.IMarkerData[]) => void;
    variables?: Variables;
    variableURLs?: string[];
    tools: Tools;
    height?: string;
    width?: string;
};

export const AntlrEditor = (props: AntlrEditorProps) => {
    const {
        script,
        setScript,
        setScriptChanged = () => false,
        theme = "vs-dark",
        languageVersion,
        setErrors,
        variables = {},
        variableURLs = [],
        tools,
        height,
        width,
    } = props;

    const setCursorPosition = useState(new Position(0, 0))[1];
    const [tempCursor] = useState(new Position(0, 0));

    const {
        id = "default-id",
        Lexer: lexer,
        Parser: parser,
        grammar,
        initialRule,
        getSuggestionsFromRange = getDefaultSuggestionsFromRange,
    } = tools;

    const customTools = {
        id,
        monarchDefinition,
        lexer,
        parser,
        grammar,
        initialRule,
        getSuggestionsFromRange,
    };

    return (
        <Editor
            tools={customTools}
            resizeLayout={[false, true, 100]}
            script={script}
            setScript={setScript}
            setScriptChanged={setScriptChanged}
            theme={theme}
            languageVersion={languageVersion}
            setCursorPosition={setCursorPosition}
            tempCursor={tempCursor}
            setErrors={setErrors}
            variables={variables}
            variableURLs={variableURLs}
            height={height}
            width={width}
        />
    );
};
