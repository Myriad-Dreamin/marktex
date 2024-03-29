import {Rule, RuleContext} from "./rule";
import {forwardRegexp, IStringStream, StringStream} from "../lib/stream";
import {CodeBlock, InlineElement, MaybeToken, StrikeThrough, TableBlock} from '../token/token';
import { unescapeBackSlash } from "../lib/escape";

export class GFMFencedCodeBlockRule implements Rule {
    readonly name: string = "GFMCodeBlock";
    readonly description: string = "GFM Markdown Block Rule";

    public static readonly backtickRegex: RegExp = /^(`{3,}) *([^`\s]+)?[^`\n]*(?:\n|$)([\s\S]*?)(?:\1`*|$)/;
    public static readonly tildeRegex: RegExp = /^(~{3,}) *([^~\s]+)?.*(?:\n|$)([\s\S]*?)(?:\1~*|$)/;

    public first: string[] = ['```', '~~~'];    

    match(s: IStringStream, _: RuleContext): MaybeToken {
        let capturing = GFMFencedCodeBlockRule.backtickRegex.exec(s.source);
        if (capturing === null) {
            capturing = GFMFencedCodeBlockRule.tildeRegex.exec(s.source);
            if (capturing === null) {
                return undefined;
            }
        }

        forwardRegexp(s, capturing);
        return new CodeBlock(capturing[3], capturing[2]);
    };
}

export class GFMTableBlockRule implements Rule {
    readonly name: string = "GFMTableBlock";
    readonly description: string = "GFM Markdown Block Rule";

    public first: string[] = ['|'];    

    public readonly tableHeadRegex: RegExp = /^\s*\|([^\n]*)\|\s*\n\s*\|?([\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\-|:]+)\s*(\n|$)/;
    public readonly dataRow: RegExp = /^[\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\|?([^\n]*)[\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*(\n|$)/;
    match(s: IStringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.tableHeadRegex.exec(s.source);
        if (!capturing) {
            return undefined;
        }
        const heads = this.parseHead(capturing[1]);
        const headProps = this.parseDelimiterRow(heads.length, capturing[2]);
        if (!headProps) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        const table = new TableBlock(heads.map(head => ctx.parseInlineElements(new StringStream(head))), headProps, []);
        while (s.source.length) {
            capturing = this.dataRow.exec(s.source);
            if (!capturing) {
                return table;
            }
            const dataRow = this.parseDataRow(ctx, heads.length, capturing[1]);
            if (dataRow) {
                table.dataRows.push(dataRow);
                forwardRegexp(s, capturing);
            } else {
                return table;
            }
        }
        return table;
    }
    
    parseDataRow(ctx: RuleContext, headsCount: number, s: string): InlineElement[][] | undefined {
        const dataRow: string[] = new Array(headsCount).fill('');
        let norm: boolean = false;
        const itemParts: string[] = [];
        let dri = 0, li = 0;
        for(let i = 0; i < s.length; i++) {
            if (norm) {
                if (s[i] === '|') {
                    if (!itemParts.length) {
                        dataRow[dri++] = s.slice(li, i);
                    } else {
                        dataRow[dri++] = itemParts.join('') + s.slice(li, i);
                        itemParts.splice(0, itemParts.length);
                    }
                    if (dri === headsCount) {
                        return dataRow.map(dataColumn => ctx.parseInlineElements(new StringStream(dataColumn)));
                    }
                    li = i+1;
                } else if (s[i] === '\\') {
                    norm = false;
                }
            } else {
                if (s[i] === '|') {
                    itemParts.push(s.slice(li, i-1));
                    li = i;
                }
                norm = true;
            }
        }
        if (dri === 0) {
            return undefined;
        }
        if (!itemParts.length) {
            dataRow[dri++] = s.slice(li, s.length);
        } else {
            dataRow[dri++] = itemParts.join('') + s.slice(li, s.length);
        }
        return dataRow.map(dataColumn => ctx.parseInlineElements(new StringStream(dataColumn)));
    }
    parseDelimiterRow(headsCount: number, s: string): number[] | undefined {
        const hps: number[] = [];
        let hp: number = -1;
        for (let i = 0; i < s.length;i++) {
            if (s[i] === '|') {
                hps.push(hp < 0 ? 0 : hp);
                if (hps.length > headsCount) {
                    return undefined;
                }
                hp = -1;
            } else if (s[i] === ':') {
                hp = (hp < 0 ? 0 : hp) | 1;
            } else if (s[i] === '-' && hp === 1) {
                hp = (hp << 1);
            }
        }
        if (hps.length === headsCount && hp >= 0) {
            return undefined;
        }
        if (hp >= 0) hps.push(hp);
        if (hps.length < headsCount) {
            return undefined;
        }
        return hps;
    }

    parseHead(s: string): string[] {
        const heads: string[] = [];
        if (!s.length) {
            return heads;
        }
        let norm: boolean = false;
        const head: string[] = [];
        if (s[0] === '|') {
            s = s.slice(1);
        }
        let li = 0;
        for(let i = 0; i < s.length; i++) {
            if (norm) {
                if (s[i] === '|') {
                    if (!head.length) {
                        heads.push(s.slice(li, i));
                    } else {
                        heads.push(head.join('') + s.slice(li, i));
                        head.splice(0, head.length);
                    }
                    li = i+1;
                } else if (s[i] === '\\') {
                    norm = false;
                }
            } else {
                if (s[i] === '|') {
                    head.push(s.slice(li, i-1));
                    li = i;
                }
                norm = true;
            }
        }
        if (!head.length) {
            heads.push(s.slice(li, s.length));
        } else {
            heads.push(head.join('') + s.slice(li, s.length));
        }
        return heads;
    }
}

export class GFMStrikeThroughRule implements Rule {
    readonly name: string = "Standard/Inline/StrikeThrough";
    readonly description: string = "GFM Markdown Inline Rule";

    public readonly regex: RegExp = /^(~{2})((?:\\\\|\\~|[^~\\])+)(~{2})/;

    public first: string[] = ['~~'];    

    match(s: IStringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        let l: string = capturing[1], r: string = capturing[3];
        if (l !== r) {
            if (l.length < r.length) {
                s.forward(capturing[0].length - 1);
                return new StrikeThrough(unescapeBackSlash(capturing[2]));
            }
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new StrikeThrough(unescapeBackSlash(capturing[2]));
    };
}
