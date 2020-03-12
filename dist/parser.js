"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
class Parser {
    constructor(parseHandlers, lexer) {
        this.lexer = lexer;
        this.parseHandlers = parseHandlers;
    }
    // noinspection JSUnusedGlobalSymbols
    parse(s) {
        while (!s.eof) {
            let b = this.lexer.parseBlockElement(s);
            while (b !== undefined) {
                b = this.parseHandlers[b.token_type](b);
            }
        }
    }
}
exports.Parser = Parser;
