"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const token_1 = require("./token");
class Lexer {
    constructor({inlineRules, blockRules}, options) {
        this.inlineRules = inlineRules;
        this.blockRules = blockRules;
        this.options = options;
    }

    lexBlockElement(source) {
        return this._lex(source, this.blockRules);
    }
    lexInlineElement(source) {
        return this._lex(source, this.inlineRules);
    }
    // noinspection JSUnusedGlobalSymbols
    lexInlineElements(s) {
        let r = [];
        let e = undefined, t = undefined;
        while (!s.eof) {
            t = this.lexInlineElement(s);
            if (e && e.token_type == token_1.TokenType.InlinePlain) {
                if (t.token_type == token_1.TokenType.InlinePlain) {
                    e.content += t.content;
                }
            } else {
                r.push(t);
                e = t;
            }
        }
        return r;
    }
    // noinspection JSUnusedGlobalSymbols
    lexBlockElements(s) {
        let r = [];
        while (!s.eof) {
            r.push(this.lexBlockElement(s));
        }
        return r;
    }
    _lex(source, rules) {
        for (let rule of rules) {
            let block = rule.match(source, this);
            if (block !== undefined) {
                return block;
            }
        }
        throw new Error("no rule match the stream at pos " + source.pos);
    }
}
exports.Lexer = Lexer;
