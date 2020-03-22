import {Parser} from "./parser/parser";
import {HighlightFunc, Renderer, RenderMiddleware} from "./renderer/renderer";
import {StringStream} from "./lib/stream";
import {newBlockRules, newInlineRules, newRules} from "./rules";
import {HTMLBlockOptions} from "./rules/std";

export interface MarkTeXParserOptions {
    enableLaTeX?: boolean;
    enableGFMRules?: boolean;

    enableHtml?: boolean;
    HTMLBlockOptions?: HTMLBlockOptions;
}


export interface MarkTeXRendererOptions extends MarkTeXParserOptions {
    parser?: Parser;

    highlight?: HighlightFunc;
    wrapCodeClassTag?: (language: string) => string;

    originStack?: RenderMiddleware[];
}

//
// originStack?: RenderMiddleware[],
//     wrapCodeClassTag?: (language: string) => string,
//     highlight?: HighlightFunc,
//     enableLaTeX?: boolean,

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    newParser(options?: MarkTeXParserOptions): Parser {
        return new Parser(newRules(options));
    },
    newRenderer(options?: MarkTeXRendererOptions): Renderer {
        return new Renderer(options?.parser || myriad.newParser(options), options);
    },
    newStringStream(str: string): StringStream {
        return new StringStream(str);
    },
    newInlineRules, newBlockRules, newRules,
    Parser, Renderer, StringStream,
};


// noinspection JSUnusedGlobalSymbols
export default myriad;
export {myriad, Parser, Renderer, StringStream};
