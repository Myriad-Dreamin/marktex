import {LaTeXParser, texCommands} from "./tex-parser";


let parser: LaTeXParser = new LaTeXParser();

describe('LaTeX parser ', () => {
    it('can parse', () => {
        console.log(parser.tex({
            texCommands,
            texCommandDefs: {}
        }, '\\newcommand{}{}[][], \\textit{}, $\\awsl$, \\n \\t '));
    })
});


