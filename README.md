# MarkTeX

LaTeX style extension for markdown

## Installation

Using npm:

```bash
npm i marktex.js
```

In Node.js:

```typescript
# es style
import myriad from 'marktex.js';
// or
import {myriad} from 'marktex.js';

# commonJs style
var {myriad} = require("marktex.js")
// or
var myriad = require("marktex.js").default
```

test it:

```typescript
console.log(myriad.newRenderer().renderString('## hello marktex.js'));
```

```html
<h2>hello marktex.js</h2>
```

