"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("../lib/stream");
const token_1 = require("../token/token");
// Standard Markdown Rules
// https://daringfireball.net/projects/markdown/syntax
// Standard Block Rules
//     NewLine
//     Quotes
//     List
//     Code
//     Header
//     Horizontal
//     LinkDefinition
//     HTML
//     Paragraph
// Standard Inline Rules
//     Link
//     ImageLink
//     Emphasis
//     Code
//
class NewLineRule {
    constructor() {
        this.name = "Standard/Block/NewLine";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^\n+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.NewLine(capturing[0]);
    }
    ;
}
exports.NewLineRule = NewLineRule;
class ParagraphRule {
    constructor() {
        this.name = "Paragraph";
        this.description = "Standard Markdown Block Rule";
    }
    // public readonly regex: RegExp = /^(?:(?:[^$]|\$(?!\$))(?:\n|$)?)+/;
    match(s, ctx) {
        let lastChar = 'a', i = 0;
        if (s.source[0] == '\n') {
            return undefined;
        }
        for (; i < s.source.length; i++) {
            // noinspection DuplicatedCode
            if (lastChar === '\n') {
                if (('\n' === s.source[i]) ||
                    // ('\t' === s.source[i]) || (s.source[i] === ' ' &&
                    // i + 3 < s.source.length && s.source[i + 1] === ' ' &&
                    // s.source[i + 2] === ' ' && s.source[i + 3] === ' ') ||
                    ('*+-'.includes(s.source[i]) && (i + 1 < s.source.length && s.source[i + 1] === ' '))) {
                    i--;
                    break;
                }
            }
            if (lastChar === '\\' && s.source[i] !== '\n') {
                lastChar = 'a';
            }
            else {
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
}
exports.ParagraphRule = ParagraphRule;
class QuotesRule {
    constructor() {
        this.name = "Standard/Block/Quotes";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^( *>[^\n]*(?:\n[^\n]+)*\n?)+/;
    }
    match(s, ctx) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.Quotes(ctx.parseBlockElements(new stream_1.StringStream(capturing[0].replace(/^ *> ?/gm, ''))));
    }
    ;
}
exports.QuotesRule = QuotesRule;
class CodeBlockRule {
    constructor() {
        this.name = "Standard/Block/CodeBlock";
        this.description = "Standard Markdown Block Rule";
    }
    match(s, _) {
        let capturing = CodeBlockRule.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.CodeBlock(capturing[0].replace(/^(?: {4}|\t)/gm, ''));
    }
    ;
}
exports.CodeBlockRule = CodeBlockRule;
CodeBlockRule.regex = /^((?: {4}|\t)[^\n]+(\n|$))+/;
class HeaderBlockRule {
    constructor() {
        this.name = "Standard/Block/HeaderBlock";
        this.description = "Standard Markdown Block Rule";
        this.atxRegex = /^(#{1,6}) ([^\n]*?)#*(?:\n|$)/;
        this.setextRegex = /^([^\n]+)\n=+(?:\n|$)/;
    }
    match(s, ctx) {
        return this.matchATX(s, ctx) || this.matchSetext(s, ctx);
    }
    ;
    matchATX(s, ctx) {
        let capturing = this.atxRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.HeaderBlock(ctx.parseInlineElements(new stream_1.StringStream(capturing[2])), capturing[1].length);
    }
    matchSetext(s, ctx) {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.HeaderBlock(ctx.parseInlineElements(new stream_1.StringStream(capturing[1])), 1);
    }
}
exports.HeaderBlockRule = HeaderBlockRule;
class HorizontalRule {
    constructor() {
        this.name = "Standard/Block/Horizontal";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})(?:\n|$)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.Horizontal();
    }
    ;
}
exports.HorizontalRule = HorizontalRule;
class LinkDefinitionRule {
    constructor() {
        this.name = "Standard/Block/LinkDefinition";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^ *\[([^\]]+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.LinkDefinition(capturing[1], capturing[2], capturing[3]);
    }
    ;
}
exports.LinkDefinitionRule = LinkDefinitionRule;
class ListBlockRule {
    constructor() {
        this.name = "Standard/Block/ListBlock";
        this.description = "Standard Markdown Block Rule";
    }
    match(s, ctx) {
        let ordered;
        if ("*+-".includes(s.source[0])) {
            ordered = false;
        }
        else if ('0' <= s.source[0] && s.source[0] <= '9') {
            ordered = true;
        }
        else {
            return undefined;
        }
        return ListBlockRule.matchBlock(new token_1.ListBlock(ordered), s, ctx);
    }
    ;
    static matchBlock(l, s, ctx) {
        let nextMarker;
        nextMarker = l.lookAhead(s);
        if (!nextMarker) {
            return undefined;
        }
        let blockContent, marker, lastSeparated = false;
        for (blockContent = '', marker = nextMarker, nextMarker = undefined; marker !== undefined; blockContent = '', marker = nextMarker, nextMarker = undefined) {
            do {
                let capturing = ListBlockRule.listBlockRegex.exec(s.source);
                if (capturing === null) {
                    throw new Error("match block failed");
                }
                stream_1.forwardRegexp(s, capturing);
                blockContent += capturing[0];
            } while (l.lookAhead0(s) && (nextMarker = l.lookAhead(s)) === undefined);
            let element = new token_1.ListElement(marker, ctx.parseBlockElements(new stream_1.StringStream(blockContent.replace(ListBlockRule.replaceRegex, ''))));
            if (!nextMarker) {
                let capturing = ListBlockRule.blankRegex.exec(s.source);
                if (capturing !== null) {
                    stream_1.forwardRegexp(s, capturing);
                    element.blankSeparated = true;
                    lastSeparated = true;
                    if (l.lookAhead0(s)) {
                        nextMarker = l.lookAhead(s);
                    }
                }
                else {
                    element.blankSeparated = lastSeparated;
                    lastSeparated = false;
                }
            }
            l.listElements.push(element);
        }
        return l;
    }
}
exports.ListBlockRule = ListBlockRule;
ListBlockRule.blankRegex = /^[\t\v\f ]*\n/;
ListBlockRule.listBlockRegex = /^([^\n]*(?:\n|$)(?:\n(?: {4}|\t))?(?:(?=[^0-9*+-])[^\n]+(?:\n|$)(?:\n(?: {4}|\t))?)*)/;
ListBlockRule.replaceRegex = /^(?: {4}|\t)/gm;
class RegExpWithTagName extends RegExp {
    constructor(r, gIndex) {
        super(r);
        this.gIndex = gIndex;
    }
    // noinspection JSUnusedGlobalSymbols
    getTagName(g) {
        return g[this.gIndex];
    }
}
exports.RegExpWithTagName = RegExpWithTagName;
class OpenTagRegExp extends RegExpWithTagName {
    constructor(r, gIndex, gOpenIndex) {
        super(r, gIndex);
        this.gOpenIndex = gOpenIndex;
    }
    isSingleton(g) {
        return g[this.gOpenIndex] !== '/';
    }
}
exports.OpenTagRegExp = OpenTagRegExp;
class HTMLBlockRule {
    constructor(validTags) {
        this.name = "Standard/Block/HTMLBlock";
        this.description = "Standard Markdown Block Rule";
        this.validTags = validTags;
    }
    // public readonly singleTonRegex: RegExp = /^/;
    // public readonly stdRegex: RegExp = /^/;
    match(s, ctx) {
        let ot = this.validTags.open_tag;
        let capturing = ot.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        if (ot.isSingleton(capturing)) {
            return new token_1.HTMLBlock(capturing[0]);
        }
        return undefined;
    }
    ;
}
exports.HTMLBlockRule = HTMLBlockRule;
class InlinePlainExceptSpecialMarksRule {
    constructor() {
        this.name = "Standard/Inline/InlinePlainExceptSpecialMarks";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.InlinePlain(capturing[0]);
    }
    ;
}
exports.InlinePlainExceptSpecialMarksRule = InlinePlainExceptSpecialMarksRule;
class InlinePlainRule {
    constructor() {
        this.name = "Standard/Inline/InlinePlain";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:[<`_*\[$\\](?:\\[<`_*\[$\\]|[^<`_*\[$\\])*|(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.InlinePlain(capturing[0]);
    }
    ;
}
exports.InlinePlainRule = InlinePlainRule;
class LinkOrImageRule {
    constructor() {
        this.name = "Standard/Inline/Link";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
        this.refRegex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\[([^\]]*)]/;
        this.autoLinkRegex = /^<(?:(?:mailto|MAILTO):([\w.!#$%&'*+\/=?^`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)|([a-zA-Z][a-zA-Z\d+.-]{1,31}:[^<>\s]*))>/;
    }
    match(s, ctx) {
        return this.matchInline(s, ctx) || this.matchAutoLink(s, ctx) || this.matchRef(s, ctx);
    }
    ;
    matchInline(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        if (capturing[1] !== '') {
            return new token_1.ImageLink(capturing[2], capturing[3], true, capturing[4]);
        }
        else {
            return new token_1.Link(capturing[2], capturing[3], true, capturing[4]);
        }
    }
    matchAutoLink(s, _) {
        let capturing = this.autoLinkRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        if (capturing[1] !== undefined) {
            return new token_1.Link(capturing[1], 'mailto:' + capturing[1], true);
        }
        else {
            return new token_1.Link(capturing[2], capturing[2], true);
        }
    }
    matchRef(s, _) {
        let capturing = this.refRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        if (capturing[1] !== '') {
            return new token_1.ImageLink(capturing[2], capturing[3], false);
        }
        else {
            return new token_1.Link(capturing[2], capturing[3], false);
        }
    }
}
exports.LinkOrImageRule = LinkOrImageRule;
class EmphasisRule {
    constructor() {
        this.name = "Standard/Inline/Emphasis";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:(_{1,2})([^_]+?)(_{1,2})|(\*{1,2})([^*]+?)(\*{1,2}))/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        let l = capturing[1] || capturing[4], r = capturing[3] || capturing[6];
        if (l !== r) {
            if (l.length < r.length) {
                s.forward(capturing[0].length - 1);
                return new token_1.Emphasis(capturing[2] || capturing[5], l.length);
            }
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.Emphasis(capturing[2] || capturing[5], l.length);
    }
    ;
}
exports.EmphasisRule = EmphasisRule;
class InlineCodeRule {
    constructor() {
        this.name = "Standard/Inline/InlineCode";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:``([^`\n\r\u2028\u2029](?:`?[^`\n\r\u2028\u2029])*)``|`([^`\n\r\u2028\u2029]+?)`)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        stream_1.forwardRegexp(s, capturing);
        return new token_1.InlineCode(capturing[1] || capturing[2]);
    }
    ;
}
exports.InlineCodeRule = InlineCodeRule;
