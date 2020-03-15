"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const stream_1 = require("../lib/stream");
const token_1 = require("../token/token");

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
