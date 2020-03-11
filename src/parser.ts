import {Lexer} from "./lexer";
import {StringStream} from "./source";
import {MaybeToken, Token} from "./token";

class Parser {
    protected lexer: Lexer;
    protected parseHandlers: { [p: number]: (b: Token) => MaybeToken };

    public constructor(parseHandlers: { [blockType: number]: (b: Token) => MaybeToken }, lexer: Lexer) {
        this.lexer = lexer;
        this.parseHandlers = parseHandlers;
    }

    // noinspection JSUnusedGlobalSymbols
    public parse(s: StringStream) {
        while (!s.eof) {
            let b: MaybeToken = this.lexer.lexBlockElement(s);
            while (b !== undefined) {
                b = this.parseHandlers[b.token_type](b);
            }
        }
    }
}


export {Parser}

