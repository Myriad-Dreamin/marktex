import {Lexer} from "./lexer";
import {blockRules, inlineRules, Rule, validTags} from "./rules";
import {Parser} from "./parser";
import {parseHandler, parseHandlers} from "./parse";
import {RuleOptions} from "./options";


interface Options {
    inlineRules?: Rule[]
    blockRules?: Rule[]
    parseHandlers?: parseHandler[]
    ruleOptions: any
}

interface parsedOptions {
    inlineRules: Rule[]
    blockRules: Rule[]
    parseHandlers: parseHandler[]
    ruleOptions: RuleOptions
}


function _parseOptions(options: Options): parsedOptions {
    options.inlineRules = options.inlineRules || inlineRules;
    options.blockRules = options.blockRules || blockRules;
    options.parseHandlers = options.parseHandlers || parseHandlers;
    options.ruleOptions = Object.assign({
        validTags: validTags
    }, options.ruleOptions);
    return <parsedOptions>options;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Lexer(options: Options): Lexer {
        let opts: parsedOptions = _parseOptions(options);
        return new Lexer({
            inlineRules: opts.inlineRules,
            blockRules: opts.blockRules,
        }, opts.ruleOptions);
    },
    Parser(options: Options): Parser {
        let opts = _parseOptions(options);
        return new Parser(opts.parseHandlers, myriad.Lexer(opts));
    },
};


export {
    myriad,
}

