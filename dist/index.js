"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const lexer_1 = require("./lexer");
const rules_1 = require("./rules");
const parser_1 = require("./parser");
const parse_1 = require("./parse");
function _parseOptions(options) {
    options.inlineRules = options.inlineRules || rules_1.inlineRules;
    options.blockRules = options.blockRules || rules_1.blockRules;
    options.parseHandlers = options.parseHandlers || parse_1.parseHandlers;
    options.ruleOptions = Object.assign({
        validTags: rules_1.validTags
    }, options.ruleOptions);
    return options;
}
// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Lexer(options) {
        let opts = _parseOptions(options);
        return new lexer_1.Lexer({
            inlineRules: opts.inlineRules,
            blockRules: opts.blockRules,
        }, opts.ruleOptions);
    },
    Parser(options) {
        let opts = _parseOptions(options);
        return new parser_1.Parser(opts.parseHandlers, myriad.Lexer(opts));
    },
};
exports.myriad = myriad;
