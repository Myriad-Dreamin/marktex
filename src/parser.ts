import {StringStream} from './source';
import {BlockElement, InlineElement, InlinePlain, MaybeToken, TokenType} from "./token";
import {Rule} from "./rules";
import {RuleOptions} from "./options";

class Parser {
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


export {Parser};
