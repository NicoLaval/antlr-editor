import React, { useState } from "react";
import Editor from "../editor";
import { Tools, Variables } from "../model";

export interface EditorProps {
    initialScript: string;
    tools: Tools;
    variables?: Variables;
    variableURLs?: string[];
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
