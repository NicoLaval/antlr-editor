<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i></i>
    <br>
    <br>
    <img src="https://github.com/garronej/antlr-editor/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/antlr-editor">
    <img src="https://img.shields.io/npm/dw/antlr-editor">
    <img src="https://img.shields.io/npm/l/antlr-editor">
</p>
<p align="center">
  <a href="https://github.com/NicoLaval/antlr-editor">Home</a>
  -
  <a href="https://github.com/NicoLaval/antlr-editor">Documentation</a>
</p>

# Install / Import

```bash
$ npm install --save antlr-editor
```

```typescript
import { myFunction, myObject } from "antlr-editor";
```

Specific imports:

```typescript
import { myFunction } from "antlr-editor/myFunction";
import { myObject } from "antlr-editor/myObject";
```

## Import from HTML, with CDN

Import it via a bundle that creates a global ( wider browser support ):

```html
<script src="//unpkg.com/antlr-editor/bundle.min.js"></script>
<script>
    const { myFunction, myObject } = antlr_editor;
</script>
```

Or import it as an ES module:

```html
<script type="module">
    import { myFunction, myObject } from "//unpkg.com/antlr-editor/zz_esm/index.js";
</script>
```

_You can specify the version you wish to import:_ [unpkg.com](https://unpkg.com)

## Contribute

```bash
npm install
npm run build
npm test
```
