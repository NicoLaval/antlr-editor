import React, { useState } from "react";
import AntlrEditor from "../editor";
import { AntlrEditorProps } from "../model";

/**
 * Primary UI component for user interaction
 */
export const EditorForStory: React.FC<AntlrEditorProps> = ({
    initialScript,
    tools,
    languageVersion,
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
            suggesterURL={[]}
            tools={tools}
        />
    );
};
