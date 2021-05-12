import React, { useState } from "react";
import Editor from "../editor";

export interface EditorProps {
    initialScript: string;
    tools: any;
}

/**
 * Primary UI component for user interaction
 */
export const EditorForStory: React.FC<EditorProps> = ({ initialScript, tools }) => {
    const [script, setScript] = useState(initialScript);
    return (
        <Editor
            script={script}
            setScript={setScript}
            languageVersion={""}
            setErrors={() => {
                return null;
            }}
            suggesterURL={[]}
            tools={tools}
        />
    );
};
