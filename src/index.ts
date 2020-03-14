import {Parser, ParserOptions} from "./parser";
import {Renderer, RenderOptions} from "./renderer";
import {StringStream} from "./source";
import {newBlockRules, newInlineRules, newRules} from "./rules";


interface Options {
    parserOptions?: ParserOptions;
    rendererOptions?: RenderOptions;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    newParser(options?: Options): Parser {
        return new Parser(options?.parserOptions);
    },
    newRenderer(options?: Options): Renderer {
        return new Renderer(myriad.newParser(options), options?.rendererOptions);
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
