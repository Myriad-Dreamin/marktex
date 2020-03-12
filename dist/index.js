"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const parser_1 = require("./parser");
const rules_1 = require("./rules");
const renderer_1 = require("./renderer");

function _parseOptions(options) {
    options.inlineRules = options.inlineRules || rules_1.inlineRules;
    options.blockRules = options.blockRules || rules_1.blockRules;
    options.ruleOptions = Object.assign({
        validTags: rules_1.validTags
    }, options.ruleOptions);
    return options;
}

// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Parser(options) {
        let opts = _parseOptions(options);
        return new parser_1.Parser({
            inlineRules: opts.inlineRules,
            blockRules: opts.blockRules,
        }, opts.ruleOptions);
    },
    Renderer(options) {
        let opts = _parseOptions(options);
        return new renderer_1.Renderer(myriad.Parser(opts), {});
    },
};
exports.myriad = myriad;
