"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const token_1 = require("./token");
const source_1 = require("./source");
const options_1 = require("./options");
function forward(s, capturing) {
    s.forward(capturing[0].length);
}
const validTags = function () {
    let validTags = /^<open_tag>|<close_tag>|<comment>|<processing_instruction>|<declaration>|<cdata>/.source;
    let open_tag = /(?:<(<tag_name>)(?:\s*<attribute>)*\s*(\/?)>)/.source;
    let close_tag = /(?:<\/(<tag_name>)\s*>)/.source;
    let comment = /(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)/;
    let processing_instruction = /(?:<?(?:(?!\?>).)*\?>)/;
    let declaration = /(?:<![A-Z]+[^>]*>)/;
    let cdata = /(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/;
    let tag_name = /(?:[a-zA-Z][a-zA-Z0-9-]*)/;
    let attribute = /(?:<attribute_name>(?:\s*=\s*<attribute_value>)?)/.source;
    let attribute_name = /(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)/;
    let attribute_value = /(?:[^/s'"=<>`]|'[^']*'|"[^"]*")/;
    attribute = attribute
        .replace('<attribute_name>', attribute_name.source)
        .replace('<attribute_value>', attribute_value.source);
    close_tag = close_tag.replace('<tag_name>', tag_name.source);
    open_tag = open_tag
        .replace('<tag_name>', tag_name.source)
        .replace('<attribute>', attribute);
    validTags = validTags
        .replace('<open_tag>', open_tag)
        .replace('<close_tag>', close_tag)
        .replace('<comment>', comment.source)
        .replace('<processing_instruction>', processing_instruction.source)
        .replace('<declaration>', declaration.source)
        .replace('<cdata>', cdata.source);
    return {
        validTags: new RegExp(validTags),
        open_tag: new options_1.OpenTagRegExp(new RegExp(open_tag), 1, 2),
        close_tag: new options_1.RegExpWithTagName(new RegExp(close_tag), 1),
        comment,
        others: [processing_instruction, declaration, cdata],
    };
}();
exports.validTags = validTags;
class ParagraphRule {
    constructor() {
        this.name = "Paragraph";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^(.+\n)+\n*/;
    }
    match(s, ctx) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Paragraph(ctx.lexInlineElements(new source_1.StringStream(capturing[0])));
    }
    ;
}
exports.ParagraphRule = ParagraphRule;
/* *+- */
/* 1.   */
class ListBlockRule {
    constructor() {
        this.name = "ListBlock";
        this.description = "Standard Markdown Block Rule";
    }
    match(s, ctx) {
        if ("*+-".includes(s.source[0])) {
            if (s.source[1] !== ' ') {
                return undefined;
            }
            let m = s.source[0];
            s.forward(2);
            return this.matchUnorderedList(m, new token_1.ListBlock(false), s, ctx);
        } else if ('0' <= s.source[0] && s.source[0] <= '9') {
            return ListBlockRule.matchOrderedListNumber(s, (num) => this.matchOrderedList(num, new token_1.ListBlock(true), s, ctx));
        }
        return;
    }
    ;
    matchUnorderedList(u, l, s, ctx) {
        for (let i = 0; ; i++) {
            if (!s.source[i]) {
                l.listElements.push(new token_1.ListElement(u, ctx.lexBlockElements(new source_1.StringStream(s.source.replace(/^(?: {4}|\t)/gm, '')))));
                s.forward(i);
                return l;
            }
            if (s.source[i] === '\n') {
                let m = s.source[i + 1];
                if (!m || "*+-".includes(m)) {
                    l.listElements.push(new token_1.ListElement(u, ctx.lexBlockElements(new source_1.StringStream(s.source.substr(0, i + 1).replace(/^(?: {4}|\t)/gm, '')))));
                    s.forward(i + 1);
                    if (!m || s.source[1] === ' ') {
                        return l;
                    }
                    s.forward(2);
                    return this.matchUnorderedList(m, l, s, ctx);
                }
            }
        }
    }
    matchOrderedList(u, l, s, ctx) {
        for (let i = 0; ; i++) {
            if (!s.source[i]) {
                l.listElements.push(new token_1.ListElement(u, ctx.lexBlockElements(new source_1.StringStream(s.source.replace(/^(?: {4}|\t)/gm, '')))));
                s.forward(i);
                return l;
            }
            if (s.source[i] === '\n') {
                let m = s.source[i + 1];
                if (!m || "0123456789".includes(m)) {
                    l.listElements.push(new token_1.ListElement(u, ctx.lexBlockElements(new source_1.StringStream(s.source.substr(0, i + 1).replace(/^(?: {4}|\t)/gm, '')))));
                    s.forward(i + 1);
                    if (!m) {
                        return l;
                    }
                    return ListBlockRule.matchOrderedListNumber(s, (num) => this.matchOrderedList(num, l, s, ctx)) || l;
                }
            }
        }
    }
    static matchOrderedListNumber(s, callback) {
        for (let i = 0; ; i++) {
            if (s.source[i] == '.') {
                if (s.source[i + 1] == ' ') {
                    let m = s.source.substr(0, i);
                    s.forward(i + 2);
                    return callback(m);
                } else {
                    return undefined;
                }
            }
            if ('0' <= s.source[i] && s.source[i] <= '9') {
                continue;
            }
            return undefined;
        }
    }
}
exports.ListBlockRule = ListBlockRule;
class QuotesRule {
    constructor() {
        this.name = "Quotes";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^( *>[^\n]+(?:\n[^\n]+)*\n*)+/;
    }
    match(s, ctx) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Quotes(ctx.lexBlockElements(new source_1.StringStream(capturing[0].replace(/^ *> ?/gm, ''))));
    }
    ;
}
class HorizontalRule {
    constructor() {
        this.name = "Horizontal";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^((?:(\* *){3,}|(- *){3,})\n?)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Horizontal();
    }
    ;
}
exports.HorizontalRule = HorizontalRule;
class CodeBlockRule {
    constructor() {
        this.name = "CodeBlock";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^((?: {4}|\t)[^\n]+\n{0,2})+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.CodeBlock(capturing[0].replace(/^{4}|\t/gm, ''));
    }
    ;
}
exports.CodeBlockRule = CodeBlockRule;
class HeaderBlockRule {
    constructor() {
        this.name = "HeaderBlock";
        this.description = "Standard Markdown Block Rule";
        this.atxRegex = /^(#{1,6}) ([^#]*)#*\n?/;
        this.setextRegex = /^((?: {4}|\t)[^\n]+\n{0,2})+/;
    }
    match(s, ctx) {
        return this.matchATX(s, ctx) || this.matchSetext(s, ctx);
    }
    ;
    matchATX(s, _) {
        let capturing = this.atxRegex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.HeaderBlock(capturing[2], capturing[1].length);
    }
    matchSetext(s, _) {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.HeaderBlock(capturing[1], 1);
    }
}
exports.HeaderBlockRule = HeaderBlockRule;
class LinkDefinitionRule {
    constructor() {
        this.name = "LinkDefinitionRule";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]*)[")])? *(?:\n|$)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.LinkDefinition(capturing[1], capturing[2], capturing[3]);
    }
    ;
}
exports.LinkDefinitionRule = LinkDefinitionRule;
class HTMLBlockRule {
    constructor() {
        this.name = "HTMLBlock";
        this.description = "Standard Markdown Block Rule";
    }
    // public readonly singleTonRegex: RegExp = /^/;
    // public readonly stdRegex: RegExp = /^/;
    match(s, ctx) {
        let ot = ctx.options.validTags.open_tag;
        let capturing = ot.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        if (ot.isSingleton(capturing)) {
            return new token_1.HTMLBlock(capturing[0]);
        }
        return undefined;
    }
    ;
}
class InlinePlainExceptSpecialMarksRule {
    constructor() {
        this.name = "InlinePlainExceptSpecialMarksRule";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:\\[<`_*\[]|[^<`_*\[])+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.InlinePlain(capturing[0]);
    }
    ;
}
exports.InlinePlainExceptSpecialMarksRule = InlinePlainExceptSpecialMarksRule;
class InlinePlainRule {
    constructor() {
        this.name = "InlinePlain";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^[\s\S]+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.InlinePlain(capturing[0]);
    }
    ;
}
exports.InlinePlainRule = InlinePlainRule;
class LinkOrImageRule {
    constructor() {
        this.name = "LinkRule";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
        this.refRegex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\s*\[([^\]]*)]/;
    }
    //\[([^\]]*)\]
    match(s, ctx) {
        return this.matchInline(s, ctx) || this.matchRef(s, ctx);
    }
    ;
    matchInline(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        if (capturing[1] !== '') {
            return new token_1.ImageLink(capturing[2], capturing[3], true, capturing[4]);
        } else {
            return new token_1.Link(capturing[2], capturing[3], true, capturing[4]);
        }
    }
    matchRef(s, _) {
        let capturing = this.refRegex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        if (capturing[1] !== '') {
            return new token_1.ImageLink(capturing[2], capturing[3], false);
        } else {
            return new token_1.Link(capturing[2], capturing[3], false);
        }
    }
}
exports.LinkOrImageRule = LinkOrImageRule;
class EmphasisRule {
    constructor() {
        this.name = "Emphasis";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:(_{1,2})([^_]+?)(_{1,2})|(\*{1,2})([^*]+?)(\*{1,2}))/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        let l = capturing[1], r = capturing[3];
        if (l !== r) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Emphasis(capturing[2], l.length);
    }
    ;
}
exports.EmphasisRule = EmphasisRule;
class InlineCodeRule {
    constructor() {
        this.name = "InlineCode";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^``([^`\n\r\u2028\u2029](?:`[^`\n\r\u2028\u2029])?)+``|`([^`\n\r\u2028\u2029]+?)`/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.InlineCode(capturing[1]);
    }
    ;
}
exports.InlineCodeRule = InlineCodeRule;
const inlineRules = [
    new InlinePlainExceptSpecialMarksRule(),
    new LinkOrImageRule(),
    new EmphasisRule(),
    new InlineCodeRule(),
    new InlinePlainRule(),
];
exports.inlineRules = inlineRules;
const blockRules = [
    new CodeBlockRule(),
    // new LinkDefinitionRule(),
    // new HTMLBlockRule(),
    new QuotesRule(),
    new HeaderBlockRule(),
    new HorizontalRule(),
    new ListBlockRule(),
    new ParagraphRule(),
];
exports.blockRules = blockRules;
// noinspection JSUnusedGlobalSymbols
function newBlockRules(enableHtml) {
    let rules0 = [
        new CodeBlockRule(),
        new LinkDefinitionRule(),
    ];
    let rules1 = [
        new QuotesRule(),
        new HeaderBlockRule(),
        new HorizontalRule(),
        new ListBlockRule(),
    ];
    let rules2 = [
        new ParagraphRule(),
    ];
    if (enableHtml) {
        rules0.push(new HTMLBlockRule());
    }
    return [...rules0, ...rules1, ...rules2];
}
exports.newBlockRules = newBlockRules;
