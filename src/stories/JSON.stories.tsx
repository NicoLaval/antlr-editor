import { Story, Meta } from "@storybook/react";
import { EditorForStory } from "./Editor";
import { AntlrEditorProps } from "../model";
import * as JSONTools from "json-antlr-tools-ts";

export default {
    title: "Editor/JSON",
    component: EditorForStory,
    argTypes: { tools: { table: { disable: true } } },
} as Meta;

const Template: Story<AntlrEditorProps> = args => <EditorForStory {...args} />;

export const Default = Template.bind({});
Default.args = { initialScript: '{"key": "value"}', tools: JSONTools, languageVersion: "json" };
