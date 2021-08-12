import { useState, useEffect, useRef } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { Position } from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "react-monaco-editor";
import { getEditorWillMount } from "./utils/providers";
import { validate } from "./utils/ParserFacade";
import { CustomTools, Options, Variables } from "../../model";
import { buildVariables, buildUniqueVariables } from "./utils/variables";
import { buildCustomOptions, buildStyle } from "./utils/customization";

import "./editor.css";

declare const window: any;

type EditorProps = {
    resizeLayout: any[];
    script: string;
    setScript: (value: string) => void;
    setScriptChanged: (value: boolean) => void;
    setCursorPosition: (e: Position) => void;
    tempCursor: Position;
    setErrors: (array: monaco.editor.IMarkerData[]) => void;
    variables: Variables;
    variableURLs: string[];
    tools: CustomTools;
    languageVersion: string;
    options: Options;
};

let errors: any = { value: "" };

const Editor = ({
    resizeLayout = [false, true, 100],
    script,
    setScript,
    setScriptChanged,
    setCursorPosition,
    tempCursor,
    setErrors,
    variables,
    variableURLs,
    tools,
    options,
}: EditorProps) => {
    const [vars, setVars] = useState(buildVariables(variables));
    const [ready, setReady] = useState(false);

    const monacoRef = useRef(null);

    useEffect(() => {
        if (monacoRef && monacoRef.current) {
            // @ts-ignore
            monacoRef.current.editor.layout();
        }
    }, [resizeLayout]);

    useEffect(() => {
        if (monacoRef && monacoRef.current) {
            // @ts-ignore
            monacoRef.current.editor.focus();
            // @ts-ignore
            monacoRef.current.editor.setPosition(new Position(tempCursor.lineNumber, tempCursor.column));
        }
    }, [tempCursor]);

    useEffect(() => {
        if (!Array.isArray(variableURLs) || variableURLs.length === 0) setReady(true);
        else {
            Promise.all(variableURLs.map(v => fetch(v)))
                .then(res =>
                    Promise.all(res.map(r => r.json())).then(res => {
                        setVars(buildUniqueVariables(res));
                        setReady(true);
                    }),
                )
                .catch(() => {
                    setReady(true);
                });
        }
    }, [variableURLs]);

    const didMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: any, customTools: any) => {
        let to: NodeJS.Timeout;
        const onDidChangeTimout = () => {
            to = setTimeout(() => onDidChange(), 2000);
        };

        const onDidChange = () => {
            const { lexer, parser, initialRule } = customTools;
            const syntaxErrors = validate({ lexer, parser, initialRule })(editor.getValue());
            const monacoErrors = [];
            for (const e of syntaxErrors) {
                monacoErrors.push({
                    startLineNumber: e.startLine,
                    startColumn: e.startCol,
                    endLineNumber: e.endLine,
                    endColumn: e.endCol,
                    message: e.message,
                    severity: monaco.MarkerSeverity.Error,
                });
            }
            const errorsString = monacoErrors.map(e => e.message).reduce((e1, e2) => e1 + ", " + e2, "");
            if (editor.getValue()) {
                setErrors([]);
                errors = { value: "" };
            } else if (errorsString !== errors.value) {
                setErrors(monacoErrors);
                errors = { value: errorsString };
            }
            window.syntaxErrors = syntaxErrors;
            const model = monaco.editor.getModels()[0];
            monaco.editor.setModelMarkers(model, "owner", monacoErrors);
        };
        editor.onDidChangeModelContent(() => {
            if (to) clearTimeout(to);
            return onDidChangeTimout();
        });
        editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) =>
            setCursorPosition(e.position),
        );
    };

    const onChange = (newValue: string) => {
        setScript(newValue);
        setScriptChanged(true);
    };

    if (!ready) return null;

    return (
        <div className="editor-container" style={buildStyle(options)}>
            <MonacoEditor
                ref={monacoRef}
                editorWillMount={getEditorWillMount(tools)(vars)}
                editorDidMount={(e, m) => didMount(e, m, tools)}
                language={tools.id}
                theme={options?.theme || "vs-dark"}
                defaultValue=""
                options={buildCustomOptions(options)}
                value={script}
                onChange={onChange}
            />
        </div>
    );
};

export default Editor;
