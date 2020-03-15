import {LaTeXParser, texCommands} from "./tex-parser";
import {StringStream} from "..";


let parser: LaTeXParser = new LaTeXParser();

describe('LaTeX parser ', () => {
    it('can parse', () => {
        console.log(parser.tex({
            texCommands,
            texCommandDefs: {},
            underMathEnv: false,
        }, new StringStream(
            '' +
            '\\newcommand{\\d}{\\mathmd{d}}' +
            '\\newcommand{\\qwq}[1]{qwq #1.},' +
            '\\d \\qwq{hh} \\textit{}, $\\awsl$, \\n \\t ')));
    })
});


