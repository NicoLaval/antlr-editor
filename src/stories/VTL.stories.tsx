import { Story, Meta } from "@storybook/react";
import { EditorForStory, StorybookEditorProps } from "./Editor";
import * as VtlTools from "vtl-2-0-antlr-tools-ts";
import { getSuggestions } from "./vtl-suggestions";
import { VariableType, VariableRole } from "../model";

export default {
    title: "Editor/VTL 2.0",
    component: EditorForStory,
    argTypes: {
        tools: { table: { disable: true } },
        def: { table: { disable: true } },
        initialScript: { table: { disable: true } },
        languageVersion: { table: { disable: true } },
    },
} as Meta;

const Template: Story<StorybookEditorProps> = args => <EditorForStory {...args} />;

const defDefault = (
    <h3>
        Insert VTL 2.0 script (VTL operators suggestion, highlighting & validation are automatically
        provided)
    </h3>
);
export const Default = Template.bind({});
Default.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    languageVersion: "vtl-2-0",
    def: defDefault,
    options: {
        minimap: true,
        theme: "vs-dark",
        hideLines: false,
        style: { height: "150px", width: "100%" },
    },
};

export const Custom = Template.bind({});
Custom.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    languageVersion: "vtl-2-0",
    def: defDefault,
    options: {
        minimap: false,
        theme: "vs-light",
        hideLines: true,
        style: {
            height: "100px",
            width: "30%",
            border: "solid 2px black",
            borderRadius: "5px",
        },
    },
};

const defVariables = (
    <>
        <h3>
            Insert VTL 2.0 script (VTL operators suggestion, highlighting & validation are automatically
            provided)
        </h3>
        <h4>
            Injected <i>Variables</i> provide <i>name</i> & <i>age</i> auto-suggestion
        </h4>
    </>
);
export const Variables = Template.bind({});
Variables.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    variables: {
        "name": { type: VariableType.STRING, role: VariableRole.IDENTIFIER },
        "age": { type: VariableType.INTEGER, role: VariableRole.MEASURE },
    },
    languageVersion: "vtl-2-0",
    def: defVariables,
    options: {},
};

const defVariableURLs = (
    <>
        <h3>
            Insert VTL 2.0 script (VTL operators suggestion, highlighting & validation are automatically
            provided)
        </h3>
        <h4>
            Injected <i>VariablesURL</i> provide lots of variable auto-suggestions: try <i>dirindicsu</i>{" "}
            or <i>echantillon_id</i> for instance
        </h4>
    </>
);
export const VariablesURL = Template.bind({});
VariablesURL.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
    variableURLs: [
        "https://inseefrlab.github.io/VTL-Lab-Resources/metadata/fideli/structure.json",
        "https://inseefrlab.github.io/VTL-Lab-Resources/metadata/crabe/structure.json",
    ],
    languageVersion: "vtl-2-0",
    def: defVariableURLs,
    options: {},
};
