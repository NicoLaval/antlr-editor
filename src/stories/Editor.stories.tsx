import { Story, Meta } from "@storybook/react";
import { EditorForStory, EditorProps } from "./Editor";
import * as VtlTools from "vtl-2-0-antlr-tools-ts";
import { getSuggestions } from "./vtl-suggestions";
import * as JSONTools from "json-antlr-tools-ts";

export default {
    title: "Editor",
    component: EditorForStory,
    argTypes: { tools: { table: { disable: true } } },
} as Meta;

const Template: Story<EditorProps> = args => <EditorForStory {...args} />;

export const VTL20 = Template.bind({});
VTL20.args = {
    initialScript: "a := 1 + 2;",
    tools: { ...VtlTools, getSuggestionsFromRange: getSuggestions },
};

export const JSON = Template.bind({});
JSON.args = { initialScript: '{"key": "value"}', tools: JSONTools };
