import {Rule, RuleContext} from "./rule";
import {forwardRegexp, StringStream} from "../lib/stream";
import {CodeBlock, MaybeToken, StrikeThrough, TableBlock} from "../token/token";
import { unescapeBackSlash } from "../lib/escape";

export class GFMFencedCodeBlockRule implements Rule {
    readonly name: string = "GFMCodeBlock";
    readonly description: string = "GFM Markdown Block Rule";

    public static readonly backtickRegex: RegExp = /^(`{3,}) *([^`\s]+)?[^`\n]*(?:\n|$)([\s\S]*?)(?:\1`*|$)/;
    public static readonly tildeRegex: RegExp = /^(~{3,}) *([^~\s]+)?.*(?:\n|$)([\s\S]*?)(?:\1~*|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
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

    public static readonly tableHeadRegex: RegExp = /^\s*\|([^\n]*)\|\s*\n\s*\|?([\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\-|:]+)\s*\n/;
    public static readonly dataRow: RegExp = /^[\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\|([^\n]*)\|[\r\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\n/;
    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = GFMTableBlockRule.tableHeadRegex.exec(s.source);
        if (!capturing) {
            return undefined;
        }
        const heads = this.parseHead(capturing[1]);
        const headProps = this.parseDelimiterRow(heads.length, capturing[2]);
        if (!headProps) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        const table = new TableBlock(heads, headProps, []);
        for (;;) {
            let capturing = GFMTableBlockRule.tableHeadRegex.exec(s.source);
            if (!capturing) {
                return table;
            }
            table.dataRows.push(this.parseDataRow(heads.length, capturing[1]));
            forwardRegexp(s, capturing);
        }
    }
    
    parseDataRow(headsCount: number, s: string): string[] {
        const dataRow: string[] = new Array(headsCount).fill('');
        let norm: boolean = false;
        const itemParts: string[] = [];
        for(let i = 0, li = 0, dri = 0; i < s.length; i++) {
            if (norm) {
                if (s[i] === '|') {
                    if (!itemParts.length) {
                        dataRow[dri++] = s.slice(li, i);
                    } else {
                        dataRow[dri++] = itemParts.join('') + s.slice(li, i);
                        itemParts.splice(0, itemParts.length);
                    }
                    if (dri === headsCount) {
                        return dataRow;
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
        return dataRow;
    }
    parseDelimiterRow(headsCount: number, s: string): number[] | undefined {
        const hps: number[] = [];
        let hp = 0;
        for (let i = 0; i < s.length;i++) {
            if (s[i] === '|') {
                hps.push(hp);
                if (hps.length > headsCount) {
                    return undefined;
                }
                hp = 0;
            } else if (s[i] === ':') {
                hp = (hp << 1) | 1;
            } else if (s[i] === '-' && hp === 1) {
                hp = (hp << 1);
            }
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
        for(let i = 0, li = 0; i < s.length; i++) {
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
        return heads;
    }
}

export class GFMStrikeThroughRule implements Rule {
    readonly name: string = "Standard/Inline/StrikeThrough";
    readonly description: string = "GFM Markdown Inline Rule";

    public readonly regex: RegExp = /^(~{2})((?:\\\\|\\~|[^~\\])+)(~{2})/;

    match(s: StringStream, _: RuleContext): MaybeToken {
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
