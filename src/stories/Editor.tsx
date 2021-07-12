import React, { useState } from "react";
import { AntlrEditor } from "../components";
import { Options, Tools, Variables } from "../model";

export interface StorybookEditorProps {
    initialScript: string;
    tools: Tools;
    variables?: Variables;
    variableURLs?: string[];
    languageVersion: string;
    def?: Element;
    options?: Options;
}

export const EditorForStory: React.FC<StorybookEditorProps> = ({
    initialScript,
    tools,
    languageVersion,
    variables = {},
    variableURLs = [],
    def = "",
    options,
}) => {
    const [script, setScript] = useState(initialScript);
    return (
        <>
            {def && <h3>{def}</h3>}
            <AntlrEditor
                script={script}
                setScript={setScript}
                languageVersion={languageVersion}
                setErrors={() => {
                    return null;
                }}
                variables={variables}
                variableURLs={variableURLs}
                tools={tools}
                options={options}
            />
        </>
    );
};
