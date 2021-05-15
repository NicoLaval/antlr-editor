import React, { useState } from "react";
import { AntlrEditor } from "../components";
import { StorybookEditorProps } from "../model";

export const EditorForStory: React.FC<StorybookEditorProps> = ({
    initialScript,
    tools,
    languageVersion,
    variables = {},
    variableURLs = [],
    def = "",
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
            />
        </>
    );
};
