"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const token_1 = require("./token");
const rules_1 = require("./rules");

class Parser {
    constructor(options) {
        this.inlineRules = (options === null || options === void 0 ? void 0 : options.inlineRules) || rules_1.inlineRules;
        this.blockRules = (options === null || options === void 0 ? void 0 : options.blockRules) || rules_1.blockRules;
    }

    parseBlockElement(source) {
        return this._parse(source, this.blockRules);
    }

    parseInlineElement(source) {
        return this._parse(source, this.inlineRules);
    }

    // noinspection JSUnusedGlobalSymbols
    parseInlineElements(s) {
        let r = [];
        let e = undefined, t = undefined;
        while (!s.eof) {
            t = this.parseInlineElement(s);
            if (e && e.token_type === token_1.TokenType.InlinePlain && t.token_type === token_1.TokenType.InlinePlain) {
                e.content += t.content;
            } else {
                r.push(t);
                e = t;
            }
        }
        return r;
    }
    // noinspection JSUnusedGlobalSymbols
    parseBlockElements(s) {
        let r = [];
        while (!s.eof) {
            r.push(this.parseBlockElement(s));
        }
        return r;
    }
    _parse(source, rules) {
        for (let rule of rules) {
            let block = rule.match(source, this);
            if (block !== undefined) {
                return block;
            }
        }
        throw new Error("no rule match the stream at pos " + source.pos);
    }
}
exports.Parser = Parser;
