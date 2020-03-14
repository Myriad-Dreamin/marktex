import {StringStream} from "../source";
import {MaybeToken, Paragraph} from "../token";
import {Rule, RuleContext} from "./rule";
import {maybeCompose, MaybeF} from "../lib/fp";


export class ParagraphRule implements Rule {
    readonly name: string = "Paragraph";
    readonly description: string = "Standard Markdown Block Rule";

    // public readonly regex: RegExp = /^(?:(?:[^$]|\$(?!\$))(?:\n|$)?)+/;

    protected readonly detect: MaybeF<{ lastChar: string, s: StringStream, i: number }>;

    constructor(opts?: { skipLaTeXBlock: boolean, skipMathBlock: boolean }) {
        let detectors = [this.detectEndPara];
        if (opts && opts.skipMathBlock) {
            detectors.push(this.detectMathBlock);
        }
        if (opts && opts.skipLaTeXBlock) {
            detectors.push(this.detectLaTeXBlock);
        }

        if (detectors.length !== 3) {
            this.detect = maybeCompose(...detectors);
        } else {
            this.detect = this.detectEndPara;
            this.match = this.fastMatch;
        }
    }

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let g: { lastChar: string, s: StringStream, i: number } = {lastChar: '\xff', s: s, i: 0};
        if (s.source[0] == '\n') {
            return undefined;
        }
        for (; g.i < s.source.length; g.i++) {
            if (this.detect(g) === undefined) {
                break;
            }
            if (g.lastChar === '\\' && s.source[g.i] !== '\n') {
                g.lastChar = 'a';
            } else {
                g.lastChar = s.source[g.i];
            }
        }
        if (!g.i) {
            return undefined;
        }
        let capturing = s.source.slice(0, g.i);
        s.forward(g.i);
        return new Paragraph(ctx.parseInlineElements(new StringStream(capturing)));
    }

    fastMatch(s: StringStream, ctx: RuleContext): MaybeToken {
        let lastChar: string = 'a', i = 0;
        if (s.source[0] == '\n') {
            return undefined;
        }
        for (; i < s.source.length; i++) {
            if (lastChar === s.source[i] && (lastChar === '$' || lastChar === '\n')) {
                i--;
                break;
            }
            if (lastChar === '\n' && s.source[i] === '\\') {
                if (i + 1 < s.source.length &&
                    (('a' <= s.source[i + 1] && s.source[i + 1] <= 'z') || ('A' <= s.source[i + 1] && s.source[i + 1] <= 'Z'))
                ) {
                    i--;
                    break;
                }
            } else if (lastChar === '\\' && s.source[i] !== '\n') {
                lastChar = 'a';
            } else {
                lastChar = s.source[i];
            }
        }
        if (!i) {
            return undefined;
        }
        let capturing = s.source.slice(0, i);
        s.forward(i);
        return new Paragraph(ctx.parseInlineElements(new StringStream(capturing)));
    }

    protected detectEndPara(g: { lastChar: string, s: StringStream, i: number }) {
        if (g.lastChar === g.s.source[g.i] && g.lastChar === '\n') {
            g.i--;
            return undefined;
        }
        return g;
    }

    protected detectMathBlock(g: { lastChar: string, s: StringStream, i: number }) {
        if (g.lastChar === g.s.source[g.i] && g.lastChar === '$') {
            g.i--;
            return undefined;
        }
        return g;
    }

    protected detectLaTeXBlock(g: { lastChar: string, s: StringStream, i: number }) {
        if (g.lastChar === '\n' && g.s.source[g.i] === '\\') {
            let nextIndex = g.i + 1, nextChar = g.s.source[nextIndex];
            if (nextIndex < g.s.source.length &&
                (('a' <= nextChar && nextChar <= 'z') || ('A' <= nextChar && nextChar <= 'Z'))
            ) {
                g.i--;
                return undefined;
            }
        }
        return g;
    }
}