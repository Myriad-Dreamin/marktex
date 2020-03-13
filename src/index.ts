import {Parser, ParserOptions} from "./parser";
import {Renderer, RenderOptions} from "./renderer";


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
};


export {
    myriad,
}

