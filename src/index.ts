import {Parser} from "./parser";
import {blockRules, inlineRules, Rule, RuleOptions} from "./rules";
import {Renderer, RenderOptions} from "./renderer";


interface Options {
    inlineRules?: Rule[];
    blockRules?: Rule[];
    ruleOptions?: any;
    renderOptions?: any;
}

interface parsedOptions {
    inlineRules: Rule[];
    blockRules: Rule[];
    ruleOptions?: RuleOptions;
    renderOptions?: RenderOptions;
}


function _parseOptions(options?: Options): parsedOptions {
    options = options || {};

    options.inlineRules = options.inlineRules || inlineRules;
    options.blockRules = options.blockRules || blockRules;

    return <parsedOptions>options;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Parser(options?: Options): Parser {
        let opts: parsedOptions = _parseOptions(options);
        return new Parser({
            inlineRules: opts.inlineRules,
            blockRules: opts.blockRules,
        }, opts.ruleOptions);
    },

    Renderer(options?: Options): Renderer {
        let opts: parsedOptions = _parseOptions(options);
        return new Renderer(myriad.Parser(options), opts.renderOptions);
    },
};


export {
    myriad,
}

