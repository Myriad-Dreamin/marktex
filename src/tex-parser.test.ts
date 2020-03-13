import {LaTeXParser, texCommands} from "./tex-parser";
import {StringStream} from "./source";


let parser: LaTeXParser = new LaTeXParser();

describe('LaTeX parser ', () => {
    it('can parse', () => {
        console.log(parser.tex({
            texCommands,
            texCommandDefs: {}
        }, new StringStream(
            '' +
            '\\newcommand{\\d}{\\mathmd{d}}' +
            '\\newcommand{\\qwq}[1]{qwq #1.},' +
            '\\d \\qwq{hh} \\textit{}, $\\awsl$, \\n \\t ')));
    })
});


