import {forwardRegexp, StringStream} from "../lib/stream";
import {Rule, RuleContext} from "./rule";
import {InlinePlain, LateXBlock, MathBlock, MaybeToken, Paragraph} from "../token/token";
import {maybeCompose, MaybeF} from "../lib/fp";

function _braceMatch(s: StringStream, l: string, r: string): string {
    if (s.source[0] == l) {
        let c: number = 0;
        for (let j = 0; j < s.source.length; j++) {
            if (s.source[j] == l) {
                c++;
            } else if (s.source[j] == r) {
                c--;
                if (c === 0) {
                    let res = s.source.slice(0, j + 1);
                    s.forward(j + 1);
                    return res;
                }
            }
        }
        let res = s.source;
        s.forward(s.source.length);
        return res;
    }
    return '';
}

export class InlineLatexCommandRule implements Rule {
    readonly name: string = "InlineLatexCommand";
    readonly description: string = "Latex Inline Rule";

    public static readonly cmdNameRegex = /^\\([a-zA-Z_]\w*)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s: StringStream) {
        let res: string = '';
        for (let i = 0; !s.eof; i = 0) {
            for (; !s.eof && ' \n\t\v\f\r'.includes(s.source[i]); i++) {
            }
            if (!'[{'.includes(s.source[i])) {
                return res;
            }
            if (i) {
                res += s.source.slice(0, i);
                s.forward(i);
            }
            res += _braceMatch(s, '{', '}');
            res += _braceMatch(s, '[', ']');
        }
        return res;
    }
}

export class LatexBlockRule implements Rule {
    readonly name: string = "LatexBlock";
    readonly description: string = "Latex Inline Rule";

    public static readonly cmdNameRegex = /^\\([a-zA-Z_]\w*)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new LateXBlock(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s: StringStream) {
        let res: string = '';
        for (let i = 0; !s.eof; i = 0) {
            for (; !s.eof && ' \t\v\f\r'.includes(s.source[i]); i++) {
            }
            if (s.source[i] == '\n') {
                i++;
                if (s.source[i] == '\n') {
                    s.forward(i);
                    return res;
                }
            }
            if (!'[{'.includes(s.source[i])) {
                return res;
            }
            if (i) {
                res += s.source.slice(0, i);
                s.forward(i);
            }
            res += _braceMatch(s, '[', ']');
            res += _braceMatch(s, '{', '}');
        }
        return res;
    }
}

export class InlineMathRule implements Rule {
    readonly name: string = "InlineMath";
    readonly description: string = "Markdown Inline Rule";

    public readonly regex: RegExp = /^\$((?:[^$]|\\\$)+)\$/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new MathBlock(capturing[1], true);
    };
}

export class MathBlockRule implements Rule {
    readonly name: string = "MathBlock";
    readonly description: string = "Markdown Block Rule";

    public readonly regex: RegExp = /^\$\$((?:[^$]|\\\$)+)\$\$/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new MathBlock(capturing[1], false);
    };
}

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