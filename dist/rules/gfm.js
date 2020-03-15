"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const stream_1 = require("../lib/stream");
const token_1 = require("../token/token");

class GFMFencedCodeBlockRule {
    constructor() {
        this.name = "GFMCodeBlock";
        this.description = "GFM Markdown Block Rule";
    }

    match(s, _) {
        let capturing = GFMFencedCodeBlockRule.backtickRegex.exec(s.source);
        if (capturing === null) {
            capturing = GFMFencedCodeBlockRule.tildeRegex.exec(s.source);
            if (capturing === null) {
                return undefined;
            }
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.CodeBlock(capturing[3], capturing[2]);
    }
    ;
}

exports.GFMFencedCodeBlockRule = GFMFencedCodeBlockRule;
GFMFencedCodeBlockRule.backtickRegex = /^(`{3,}) *([^`\s]+)?[^`\n]*(?:\n|$)([\s\S]*?)(?:\1`*|$)/;
GFMFencedCodeBlockRule.tildeRegex = /^(~{3,}) *([^~\s]+)?.*(?:\n|$)([\s\S]*?)(?:\1~*|$)/;
