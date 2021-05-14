import React, { useState } from "react";
import { AntlrEditor } from "../components";
import { AntlrEditorProps } from "../model";

/**
 * Primary UI component for user interaction
 */
export const EditorForStory: React.FC<AntlrEditorProps> = ({
    initialScript,
    tools,
    languageVersion,
    variables = {},
    variableURLs = [],
}) => {
    const [script, setScript] = useState(initialScript);
    return (
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
    );
};
