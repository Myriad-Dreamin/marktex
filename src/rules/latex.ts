import {forwardRegexp, IStringStream} from "../lib/stream";
import {Rule, RuleContext} from "./rule";
import {InlinePlain, LaTeXBlock, MathBlock, MaybeToken} from "../token/token";

function _braceMatch(s: IStringStream, l: string, r: string): string {
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

    match(s: IStringStream, _: RuleContext): MaybeToken {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s: IStringStream) {
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

    match(s: IStringStream, _: RuleContext): MaybeToken {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new LaTeXBlock(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s: IStringStream) {
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

    match(s: IStringStream, _: RuleContext): MaybeToken {
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

    match(s: IStringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new MathBlock(capturing[1], false);
    };
}

export {LazyParagraphRule} from './std';
