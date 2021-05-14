# Antlr Editor

[![ci](https://github.com/NicoLaval/antlr-editor/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/NicoLaval/antlr-editor/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/antlr-editor.svg)](https://badge.fury.io/js/antlr-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

See example into deployed [Storybook](https://nicolaval.github.io/antlr-editor/index.html)

## Usage

```bash
yarn add antlr-editor
```

## Props

| Name            |   Type   | Default value |
| --------------- | :------: | :-----------: |
| script          |  string  |       -       |
| setScript       | Function |       -       |
| languageVersion |  string  |       -       |
| setErrors       | Function |       -       |
| suggesterURL    | string[] |       -       |
| tools           | Tools \* |       -       |

### `Tools`

| Name                    |     Type      | Default value |
| ----------------------- | :-----------: | :-----------: |
| id                      |    string     |       -       |
| initialRule             |   Function    |       -       |
| grammar                 |    string     |       -       |
| Lexer                   | Antlr4 Lexer  |       -       |
| Parser                  | Antlr4 Parser |       -       |
| getSuggestionsFromRange |   Function    |   () => []    |
