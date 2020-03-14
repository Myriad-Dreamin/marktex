"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./token");
const source_1 = require("./source");
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
        open_tag: new OpenTagRegExp(new RegExp(open_tag), 1, 2),
        close_tag: new RegExpWithTagName(new RegExp(close_tag), 1),
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
exports.NewLineRule = NewLineRule;
class ParagraphRule {
    constructor(skipLaTeXBlock) {
        this.name = "Paragraph";
        this.description = "Standard Markdown Block Rule";
        this.skipLaTeXBlock = skipLaTeXBlock;
    }

    match(s, ctx) {
        let lastChar = 'a', i = 0;
        if (s.source[0] == '\n') {
            return undefined;
        }
        if (this.skipLaTeXBlock) {
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
        } else {
            for (; i < s.source.length; i++) {
                if (lastChar === s.source[i] && '$\n'.includes(lastChar)) {
                    i--;
                    break;
                }
                if (lastChar === '\\' && s.source[i] !== '\n') {
                    lastChar = 'a';
                } else {
                    lastChar = s.source[i];
                }
            }
        }
        if (!i) {
            return undefined;
        }
        let capturing = s.source.slice(0, i);
        s.forward(i);
        return new token_1.Paragraph(ctx.parseInlineElements(new source_1.StringStream(capturing)));
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
        this.regex = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})(?:\n|$)/;
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
    }
    match(s, _) {
        let capturing = CodeBlockRule.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new token_1.CodeBlock(capturing[0].replace(/^(?: {4}|\t)/gm, ''));
    }
    ;
}
exports.CodeBlockRule = CodeBlockRule;
CodeBlockRule.regex = /^((?: {4}|\t)[^\n]+(\n|$))+/;
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
    constructor(validTags) {
        this.name = "HTMLBlock";
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
function _braceMatch(s, l, r) {
    if (s.source[0] == l) {
        let c = 0;
        for (let j = 0; j < s.source.length; j++) {
            if (s.source[j] == l) {
                c++;
            }
            else if (s.source[j] == r) {
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
        forward(s, capturing);
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
        forward(s, capturing);
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
class InlinePlainExceptSpecialMarksRule {
    constructor() {
        this.name = "InlinePlainExceptSpecialMarks";
        this.description = "Standard Markdown Inline Rule";
        this.regex = /^(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+/;
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
        this.regex = /^(?:[<`_*\[$\\](?:\\[<`_*\[$\\]|[^<`_*\[$\\])*|(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+)/;
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
        forward(s, capturing);
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
        forward(s, capturing);
        return new token_1.MathBlock(capturing[1], false);
    }
    ;
}

exports.MathBlockRule = MathBlockRule;
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
        }
        else {
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
        }
        else {
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
        forward(s, capturing);
        return new token_1.CodeBlock(capturing[3], capturing[2]);
    }
    ;
}

exports.GFMFencedCodeBlockRule = GFMFencedCodeBlockRule;
GFMFencedCodeBlockRule.backtickRegex = /^(`{3,}) *([^`\s]+)?[^`\n]*(?:\n|$)([\s\S]*?)(?:\1`*|$)/;
GFMFencedCodeBlockRule.tildeRegex = /^(~{3,}) *([^~\s]+)?.*(?:\n|$)([\s\S]*?)(?:\1~*|$)/;
exports.inlineRules = newInlineRules();
exports.blockRules = newBlockRules();

// noinspection JSUnusedGlobalSymbols
function newBlockRules(opts) {
    let rules0 = [
        new NewLineRule(),
        new CodeBlockRule(),
        new LinkDefinitionRule(),
        new MathBlockRule(),
        new LatexBlockRule(),
    ];
    let rules1 = [
        new QuotesRule(),
        new HeaderBlockRule(),
        new HorizontalRule(),
        new ListBlockRule(),
    ];
    let rules2 = [
        new ParagraphRule((opts === null || opts === void 0 ? void 0 : opts.enableLaTeX) || false),
    ];
    // default enable
    if ((opts === null || opts === void 0 ? void 0 : opts.enableGFMRules) !== false) {
        rules0.push(new GFMFencedCodeBlockRule());
    }
    if (opts === null || opts === void 0 ? void 0 : opts.enableHtml) {
        rules0.push(new HTMLBlockRule((opts === null || opts === void 0 ? void 0 : opts.validTags) || validTags));
    }
    return [...rules0, ...rules1, ...rules2];
}
exports.newBlockRules = newBlockRules;
// noinspection JSUnusedGlobalSymbols
function newInlineRules(opts) {
    let rules0 = [
        new InlinePlainExceptSpecialMarksRule(),
        new LinkOrImageRule(),
        new InlineMathRule(),
    ];
    let rules1 = [
        new EmphasisRule(),
        new InlineCodeRule(),
        new InlinePlainRule(),
    ];
    // default not enable
    if ((opts === null || opts === void 0 ? void 0 : opts.enableLaTeX) !== false) {
        rules0.push(new InlineLatexCommandRule());
    }
    return [...rules0, ...rules1];
}

exports.newInlineRules = newInlineRules;

function newRules(opts) {
    return {
        inlineRules: newInlineRules(opts),
        blockRules: newBlockRules(opts),
    };
}

exports.newRules = newRules;
