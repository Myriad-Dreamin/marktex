import {Parser, ParserOptions} from "./parser";
import {Renderer, RenderOptions} from "./renderer";
import {StringStream} from "./source";
import {newBlockRules, newInlineRules, Rule} from "./rules";


interface Options {
    parserOptions?: ParserOptions;
    renderOptions?: RenderOptions;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Parser(options?: Options): Parser {
        return new Parser(options?.parserOptions);
    },
    Renderer(options?: Options): Renderer {
        return new Renderer(myriad.Parser(options), options?.renderOptions);
    },
    StringStream(str: string) : StringStream {
        return new StringStream(str);
    },
    newInlineRules,
    newBlockRules,
};


export {
    myriad,
}

