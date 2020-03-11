import {StringStream} from './source';
import {BlockElement, InlineElement, InlinePlain, MaybeToken, TokenType} from "./token";
import {Rule} from "./rules";
import {RuleOptions} from "./options";

class Lexer {
    protected blockRules: Rule[];
    protected inlineRules: Rule[];
    public readonly options: RuleOptions;

    public constructor(
        {inlineRules, blockRules}: { inlineRules: Rule[], blockRules: Rule[] },
        options: RuleOptions) {
        this.inlineRules = inlineRules;
        this.blockRules = blockRules;
        this.options = options;
    }

    lexBlockElement(source: StringStream): BlockElement {
        return this._lex(source, this.blockRules)
    }

    lexInlineElement(source: StringStream): InlineElement {
        return this._lex(source, this.inlineRules)
    }

    // noinspection JSUnusedGlobalSymbols
    lexInlineElements(s: StringStream): InlineElement[] {
        let r: InlineElement[] = [];
        let e: MaybeToken = undefined, t: MaybeToken = undefined;
        while (!s.eof) {
            t = this.lexInlineElement(s);
            if (e && e.token_type == TokenType.InlinePlain) {
                if (t.token_type == TokenType.InlinePlain) {
                    (<InlinePlain>e).content += (<InlinePlain>t).content;
                }
            } else {
                r.push(t);
                e = t;
            }
        }
        return r;
    }

    // noinspection JSUnusedGlobalSymbols
    lexBlockElements(s: StringStream): BlockElement[] {
        let r: BlockElement[] = [];
        while (!s.eof) {
            r.push(this.lexBlockElement(s));
        }
        return r;
    }

    _lex(source: StringStream, rules: Rule[]) {
        for (let rule of rules) {
            let block: MaybeToken = rule.match(source, this);
            if (block !== undefined) {
                return block
            }
        }

        throw new Error("no rule match the stream at pos " + source.pos);
    }
}


export {Lexer};
