"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const stream_1 = require("../lib/stream");
const token_1 = require("../token/token");
const fp_1 = require("../lib/fp");

function _braceMatch(s, l, r) {
    if (s.source[0] == l) {
        let c = 0;
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

class InlineLatexCommandRule {
    constructor() {
        this.name = "InlineLatexCommand";
        this.description = "Latex Inline Rule";
    }

    match(s, _) {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.InlinePlain(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s) {
        let res = '';
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

exports.InlineLatexCommandRule = InlineLatexCommandRule;
InlineLatexCommandRule.cmdNameRegex = /^\\([a-zA-Z_]\w*)/;

class LatexBlockRule {
    constructor() {
        this.name = "LatexBlock";
        this.description = "Latex Inline Rule";
    }

    match(s, _) {
        let capturing = InlineLatexCommandRule.cmdNameRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.LateXBlock(capturing[0] + this.braceMatch(s));
    }

    braceMatch(s) {
        let res = '';
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

exports.LatexBlockRule = LatexBlockRule;
LatexBlockRule.cmdNameRegex = /^\\([a-zA-Z_]\w*)/;

class InlineMathRule {
    constructor() {
        this.name = "InlineMath";
        this.description = "Markdown Inline Rule";
        this.regex = /^\$((?:[^$]|\\\$)+)\$/;
    }

    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.MathBlock(capturing[1], true);
    }
    ;
}

exports.InlineMathRule = InlineMathRule;

class MathBlockRule {
    constructor() {
        this.name = "MathBlock";
        this.description = "Markdown Block Rule";
        this.regex = /^\$\$((?:[^$]|\\\$)+)\$\$/;
    }

    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.MathBlock(capturing[1], false);
    }
    ;
}

exports.MathBlockRule = MathBlockRule;

class ParagraphRule {
    constructor(opts) {
        this.name = "Paragraph";
        this.description = "Standard Markdown Block Rule";
        let detectors = [this.detectEndPara];
        if (opts && opts.skipMathBlock) {
            detectors.push(this.detectMathBlock);
        }
        if (opts && opts.skipLaTeXBlock) {
            detectors.push(this.detectLaTeXBlock);
        }
        if (detectors.length !== 3) {
            this.detect = fp_1.maybeCompose(...detectors);
        } else {
            this.detect = this.detectEndPara;
            this.match = this.fastMatch;
        }
    }

    match(s, ctx) {
        let g = {lastChar: '\xff', s: s, i: 0};
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
        return new token_1.Paragraph(ctx.parseInlineElements(new stream_1.StringStream(capturing)));
    }

    fastMatch(s, ctx) {
        let lastChar = 'a', i = 0;
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
                    (('a' <= s.source[i + 1] && s.source[i + 1] <= 'z') || ('A' <= s.source[i + 1] && s.source[i + 1] <= 'Z'))) {
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
        return new token_1.Paragraph(ctx.parseInlineElements(new stream_1.StringStream(capturing)));
    }

    detectEndPara(g) {
        if (g.lastChar === g.s.source[g.i] && g.lastChar === '\n') {
            g.i--;
            return undefined;
        }
        return g;
    }

    detectMathBlock(g) {
        if (g.lastChar === g.s.source[g.i] && g.lastChar === '$') {
            g.i--;
            return undefined;
        }
        return g;
    }

    detectLaTeXBlock(g) {
        if (g.lastChar === '\n' && g.s.source[g.i] === '\\') {
            let nextIndex = g.i + 1, nextChar = g.s.source[nextIndex];
            if (nextIndex < g.s.source.length &&
                (('a' <= nextChar && nextChar <= 'z') || ('A' <= nextChar && nextChar <= 'Z'))) {
                g.i--;
                return undefined;
            }
        }
        return g;
    }
}

exports.ParagraphRule = ParagraphRule;
