import { Story, Meta } from "@storybook/react";
import { EditorForStory, EditorProps } from "./Editor";
import * as VtlTools from "vtl-2-0-antlr-tools-ts";
import { getSuggestions } from "./vtl-suggestions";
import { VariableType, VariableRole } from "../model";

export default {
    title: "Editor/VTL 2.0",
    component: EditorForStory,
    argTypes: { tools: { table: { disable: true } } },
} as Meta;

const Template: Story<EditorProps> = args => <EditorForStory {...args} />;

export const Default = Template.bind({});
Default.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
};

export const Variables = Template.bind({});
Variables.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    variables: {
        "name": { type: VariableType.STRING, role: VariableRole.IDENTIFIER },
        "age": { type: VariableType.INTEGER, role: VariableRole.MEASURE },
    },
};

export const VariablesURL = Template.bind({});
VariablesURL.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    variableURLs: [],
};
