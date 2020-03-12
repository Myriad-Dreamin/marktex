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
class NewLineRule {
    constructor() {
        this.name = "NewLine";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^\n+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.NewLine(capturing[0]);
    }
    ;
}
class ParagraphRule {
    constructor() {
        this.name = "Paragraph";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^(?:.(?:\n|$)?)+/;
    }
    match(s, ctx) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Paragraph(ctx.parseInlineElements(new source_1.StringStream(capturing[0])));
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
        let ordered;
        if ("*+-".includes(s.source[0])) {
            ordered = false;
        } else if ('0' <= s.source[0] && s.source[0] <= '9') {
            ordered = true;
        } else {
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
                forward(s, capturing);
                blockContent += capturing[0];
            } while (l.lookAhead0(s) && (nextMarker = l.lookAhead(s)) === undefined);
            let element = new token_1.ListElement(marker, ctx.parseBlockElements(new source_1.StringStream(blockContent.replace(ListBlockRule.replaceRegex, ''))));
            if (!nextMarker) {
                let capturing = ListBlockRule.blankRegex.exec(s.source);
                if (capturing !== null) {
                    forward(s, capturing);
                    element.blankSeparated = true;
                    lastSeparated = true;
                    if (l.lookAhead0(s)) {
                        nextMarker = l.lookAhead(s);
                    }
                } else {
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
ListBlockRule.listBlockRegex = /^([^\n]*(?:\n|$)(?:(?=[^\n0-9*+-])[^\n]*(?:\n|$))*)/;
ListBlockRule.replaceRegex = /^(?: {4}|\t)/gm;
class QuotesRule {
    constructor() {
        this.name = "Quotes";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^( *>[^\n]*(?:\n[^\n]+)*\n?)+/;
    }
    match(s, ctx) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.Quotes(ctx.parseBlockElements(new source_1.StringStream(capturing[0].replace(/^ *> ?/gm, ''))));
    }
    ;
}
exports.QuotesRule = QuotesRule;
class HorizontalRule {
    constructor() {
        this.name = "Horizontal";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})\n?/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
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
        this.regex = /^((?: {4}|\t)[^\n]+(\n|$))+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.CodeBlock(capturing[0].replace(/^(?: {4}|\t)/gm, ''));
    }
    ;
}
exports.CodeBlockRule = CodeBlockRule;
class HeaderBlockRule {
    constructor() {
        this.name = "HeaderBlock";
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
        forward(s, capturing);
        return new token_1.HeaderBlock(ctx.parseInlineElements(new source_1.StringStream(capturing[2])), capturing[1].length);
    }

    matchSetext(s, ctx) {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.HeaderBlock(ctx.parseInlineElements(new source_1.StringStream(capturing[1])), 1);
    }
}
exports.HeaderBlockRule = HeaderBlockRule;
class LinkDefinitionRule {
    constructor() {
        this.name = "LinkDefinition";
        this.description = "Standard Markdown Block Rule";
        this.regex = /^ *\[([^\]]+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
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
        this.name = "InlinePlainExceptSpecialMarks";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:\\[<`_*\[]|[^<`_*\[])+/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
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
        if (capturing === null) {
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
        this.name = "Link";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
        this.refRegex = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\s*\[([^\]]*)]/;
    }
    match(s, ctx) {
        return this.matchInline(s, ctx) || this.matchRef(s, ctx);
    }
    ;
    matchInline(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
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
        if (capturing === null) {
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
        forward(s, capturing);
        return new token_1.Emphasis(capturing[2] || capturing[5], l.length);
    }
    ;
}
exports.EmphasisRule = EmphasisRule;
class InlineCodeRule {
    constructor() {
        this.name = "InlineCode";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:``([^`\n\r\u2028\u2029](?:`?[^`\n\r\u2028\u2029])*)``|`([^`\n\r\u2028\u2029]+?)`)/;
    }
    match(s, _) {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.InlineCode(capturing[1] || capturing[2]);
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
    new NewLineRule(),
    new CodeBlockRule(),
    new LinkDefinitionRule(),
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
        new NewLineRule(),
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
