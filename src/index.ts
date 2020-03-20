import {Parser, ParserOptions} from "./parser/parser";
import {HighlightFunc, Renderer, RenderMiddleware, RenderOptions} from "./renderer/renderer";
import {StringStream} from "./lib/stream";
import {newBlockRules, newInlineRules, newRules} from "./rules";
import {HTMLBlockOptions} from "./rules/std";

interface Options {
    enableLaTeX?: boolean;
    enableGFMRules?: boolean;

    enableHtml?: boolean;
    HTMLBlockOptions?: HTMLBlockOptions;

    highlight?: HighlightFunc;
    wrapCodeClassTag?: (language: string) => string;

    originStack?: RenderMiddleware[],
}

//
// originStack?: RenderMiddleware[],
//     wrapCodeClassTag?: (language: string) => string,
//     highlight?: HighlightFunc,
//     enableLaTeX?: boolean,

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    newParser(options?: Options): Parser {
        return new Parser(newRules(options));
    },
    newRenderer(options?: Options): Renderer {
        return new Renderer(myriad.newParser(options), options);
    },
    newStringStream(str: string): StringStream {
        return new StringStream(str);
    },
    newInlineRules, newBlockRules, newRules,
    Parser, Renderer, StringStream,
};


// noinspection JSUnusedGlobalSymbols
export default myriad;
export {myriad, Options, Parser, Renderer, StringStream};
