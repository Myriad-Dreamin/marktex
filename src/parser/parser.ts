import {StringStream} from '..';
import {BlockElement, InlineElement, InlinePlain, MaybeToken, TokenType} from "../token/token";
import {Rule} from '../rules/rule';
import {blockRules, inlineRules} from "../rules";

export interface ParserOptions {
    inlineRules?: Rule[];
    blockRules?: Rule[];
}

export class Parser {
    protected blockRules: Rule[];
    protected inlineRules: Rule[];

    public constructor(options?: ParserOptions) {

        this.inlineRules = options?.inlineRules || inlineRules;
        this.blockRules = options?.blockRules || blockRules;
    }


    parseBlockElement(source: StringStream): BlockElement {
        return this._parse(source, this.blockRules)
    }

    parseInlineElement(source: StringStream): InlineElement {
        return this._parse(source, this.inlineRules)
    }

    // noinspection JSUnusedGlobalSymbols
    parseInlineElements(s: StringStream): InlineElement[] {
        let r: InlineElement[] = [];
        let e: MaybeToken = undefined, t: MaybeToken = undefined;
        while (!s.eof) {
            t = this.parseInlineElement(s);
            if (e && e.token_type == TokenType.InlinePlain && t.token_type == TokenType.InlinePlain) {
                (<InlinePlain>e).content += (<InlinePlain>t).content;
            } else {
                r.push(t);
                e = t;
            }
        }
        return r;
    }

    // noinspection JSUnusedGlobalSymbols
    parseBlockElements(s: StringStream): BlockElement[] {
        let r: BlockElement[] = [];
        while (!s.eof) {
            r.push(this.parseBlockElement(s));
        }
        return r;
    }

    _parse(source: StringStream, rules: Rule[]) {
        for (let rule of rules) {
            let block: MaybeToken = rule.match(source, this);
            if (block !== undefined) {
                return block
            }
        }

        throw new Error("no rule match the stream at pos " + source.pos);
    }
}
