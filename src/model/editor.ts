import { Variables } from "./variables";
import { Tools } from "./tools";

export interface AntlrEditorProps {
    initialScript: string;
    tools: Tools;
    variables?: Variables;
    variableURLs?: string[];
    languageVersion: string;
}
