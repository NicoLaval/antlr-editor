# Antlr Editor

[![ci](https://github.com/NicoLaval/antlr-editor/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/NicoLaval/antlr-editor/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/antlr-editor.svg)](https://badge.fury.io/js/antlr-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

See example into deployed [Storybook](https://nicolaval.github.io/antlr-editor/index.html)

## Usage

### Install

```bash
yarn add antlr-editor antlr4ts monaco-editor react-monaco-editor
```

### AntlrEditor

```javascript
import React, { useState } from "react";
import { AntlrEditor } from "antlr-editor";
import * as Tools from "my-antlr-lib";
import { getSuggestions } from "./custom-suggestions";

const Editor = ({}) => {
    const [script, setScript] = useState("");
    const [errors, setErros] = useState([]);
    const customTools = { ...tools, getSuggestionsFromRange: getSuggestions };
    return (
        <>
            <AntlrEditor
                script={script}
                setScript={setScript}
                languageVersion="my-language"
                setErrors={setErrors}
                variables={{}}
                variableURLs={[]}
                tools={Tools}
            />
            {errors.length > 0 && <div>{`Errors: ${errors.join(" - ")}`}</div>}
        </>
    );
};

export default Editor;
```

### AntlrEditor Props

| Name            |   Type   | Default value |
| --------------- | :------: | :-----------: |
| script          |  string  |       -       |
| setScript       | Function |       -       |
| languageVersion |  string  |       -       |
| setErrors       | Function |       -       |
| tools           | Tools \* |       -       |
| theme           |  string  |    vs-dark    |
| variables       |  Object  |      { }      |
| variableURLs    | string[] |      [ ]      |

### Tools Props

| Name                    |     Type      | Default value |
| ----------------------- | :-----------: | :-----------: |
| id                      |    string     |       -       |
| initialRule             |    string     |       -       |
| grammar                 |    string     |       -       |
| Lexer                   | Antlr4 Lexer  |       -       |
| Parser                  | Antlr4 Parser |       -       |
| getSuggestionsFromRange |   Function    |   () => []    |
