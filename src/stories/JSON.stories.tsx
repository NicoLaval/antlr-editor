import { Story, Meta } from "@storybook/react";
import { EditorForStory, EditorProps } from "./Editor";
import * as JSONTools from "json-antlr-tools-ts";

export default {
    title: "Editor/JSON",
    component: EditorForStory,
    argTypes: { tools: { table: { disable: true } } },
} as Meta;

const Template: Story<EditorProps> = args => <EditorForStory {...args} />;

export const Default = Template.bind({});
Default.args = { initialScript: '{"key": "value"}', tools: JSONTools };
