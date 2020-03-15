# MarkTeX

LaTeX style extension for markdown

## Installation

Using npm:

```bash
npm i marktex.js
```

In Node.js:

```typescript
import myriad from 'marktex.js';
// or
import {myriad} from 'marktex.js';
```

test it:

```typescript
console.log(myriad.newRenderer().renderString('## hello marktex.js'));

/*
<h2>hello marktex.js</h2>
*/
```