"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const stream_1 = require("../lib/stream");
const token_1 = require("../token/token");
const fp_1 = require("../lib/fp");

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
