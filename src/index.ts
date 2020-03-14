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
    Parser(options?: Options): Parser {
        return new Parser(options?.parserOptions);
    },
    Renderer(options?: Options): Renderer {
        return new Renderer(myriad.Parser(options), options?.rendererOptions);
    },
    StringStream(str: string): StringStream {
        return new StringStream(str);
    },
    newInlineRules,
    newBlockRules,
    newRules,
};


export {
    myriad,
}

