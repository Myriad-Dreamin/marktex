import {Parser} from "./parser";
import {blockRules, inlineRules, Rule, validTags} from "./rules";
import {Render} from "./render";
import {RuleOptions} from "./options";


interface Options {
    inlineRules?: Rule[]
    blockRules?: Rule[]
    ruleOptions: any
}

interface parsedOptions {
    inlineRules: Rule[]
    blockRules: Rule[]
    ruleOptions: RuleOptions
}


function _parseOptions(options: Options): parsedOptions {
    options.inlineRules = options.inlineRules || inlineRules;
    options.blockRules = options.blockRules || blockRules;
    options.ruleOptions = Object.assign({
        validTags: validTags
    }, options.ruleOptions);
    return <parsedOptions>options;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Parser(options: Options): Parser {
        let opts: parsedOptions = _parseOptions(options);
        return new Parser({
            inlineRules: opts.inlineRules,
            blockRules: opts.blockRules,
        }, opts.ruleOptions);
    },
    Render(options: Options): Render {
        let opts = _parseOptions(options);
        return new Render(myriad.Parser(opts), {});
    },
};


export {
    myriad,
}

