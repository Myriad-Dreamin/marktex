import {StringStream} from '../';
import {BlockElement, InlineElement, InlineParagraph, InlinePlain, MaybeToken, Paragraph, TokenType} from '../token/token';
import {Rule} from '../rules/rule';
import {blockRules, inlineRules} from '../rules';
import { IStringStream } from '../lib/stream';

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


    parseBlockElement(source: IStringStream): BlockElement {
        return this._parse(source, this.blockRules);
    }

    parseInlineElement(source: IStringStream): InlineElement {
        return this._parse(source, this.inlineRules);
    }

    // noinspection JSUnusedGlobalSymbols
    parseInlineElements(s: IStringStream): InlineElement[] {
        const r: InlineElement[] = [];
        let e: MaybeToken, t: MaybeToken;
        while (!s.eof) {
            t = this.parseInlineElement(s);
            if (e && e.token_type == TokenType.InlinePlain && t.token_type == TokenType.InlinePlain) {
                (e as InlinePlain).content += (t as InlinePlain).content;
            } else {
                r.push(t);
                e = t;
            }
        }
        return r;
    }

    // noinspection JSUnusedGlobalSymbols
    parseBlockElements(s: IStringStream): BlockElement[] {
        const r: BlockElement[] = [];
        let t: MaybeToken;
        const streams: IStringStream[] = [];
        while (!s.eof) {
            t = this.parseBlockElement(s);
            if (!t) {
                break;
            }
            if (t.token_type == TokenType.InlineParagraph) {
                streams.push((t as InlineParagraph).inlineText);
            } else {
                if (streams.length) {
                    r.push(new Paragraph(this.parseInlineElements(StringStream.join(streams))));
                    streams.splice(0, streams.length);
                }
                r.push(t);
            }
        }
        if (streams.length) {
            r.push(new Paragraph(this.parseInlineElements(StringStream.join(streams))));
            streams.splice(0, streams.length);
        }
        return r;
    }

    _parse(source: IStringStream, rules: Rule[]) {
        for (const rule of rules) {
            const block: MaybeToken = rule.match(source, this);
            if (block !== undefined) {
                return block;
            }
        }

        throw source.wrapErr(new Error('no rule match the stream'));
    }
}
