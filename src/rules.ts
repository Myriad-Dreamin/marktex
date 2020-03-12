import {
    BlockElement,
    CodeBlock,
    Emphasis,
    HeaderBlock,
    Horizontal,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlineElement,
    InlinePlain,
    Link,
    LinkDefinition,
    ListBlock,
    ListElement,
    MaybeToken,
    NewLine,
    Paragraph,
    Quotes
} from "./token";
import {StringStream} from './source';


export class RegExpWithTagName extends RegExp {
    protected gIndex: number;

    constructor(r: RegExp, gIndex: number) {
        super(r);
        this.gIndex = gIndex;
    }

    // noinspection JSUnusedGlobalSymbols
    getTagName(g: RegExpExecArray): string {
        return g[this.gIndex];
    }
}

export class OpenTagRegExp extends RegExpWithTagName {
    protected gOpenIndex: number;

    constructor(r: RegExp, gIndex: number, gOpenIndex: number) {
        super(r, gIndex);
        this.gOpenIndex = gOpenIndex;
    }

    isSingleton(g: RegExpExecArray): boolean {
        return g[this.gOpenIndex] !== '/'
    }
}

export interface HTMLTagsRegexps {
    validTags: RegExp;
    open_tag: OpenTagRegExp;
    close_tag: RegExpWithTagName;
    comment: RegExp;
    others: RegExp[];
}

export interface RuleOptions {
    validTags: HTMLTagsRegexps;
}

interface RuleContext {
    options: RuleOptions

    parseBlockElement(source: StringStream): BlockElement

    parseInlineElement(source: StringStream): InlineElement

    parseBlockElements(source: StringStream): BlockElement[]

    parseInlineElements(source: StringStream): InlineElement[]
}

interface Rule {
    readonly name?: string
    readonly description?: string

    match: (s: StringStream, ctx: RuleContext) => MaybeToken
}

function forward(s: StringStream, capturing: RegExpExecArray) {
    s.forward(capturing[0].length)
}

const validTags: HTMLTagsRegexps = function (): HTMLTagsRegexps {
    let validTags: string = /^<open_tag>|<close_tag>|<comment>|<processing_instruction>|<declaration>|<cdata>/.source;
    let open_tag: string = /(?:<(<tag_name>)(?:\s*<attribute>)*\s*(\/?)>)/.source;
    let close_tag: string = /(?:<\/(<tag_name>)\s*>)/.source;
    let comment: RegExp = /(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)/;
    let processing_instruction: RegExp = /(?:<?(?:(?!\?>).)*\?>)/;
    let declaration: RegExp = /(?:<![A-Z]+[^>]*>)/;
    let cdata: RegExp = /(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/;

    let tag_name: RegExp = /(?:[a-zA-Z][a-zA-Z0-9-]*)/;
    let attribute: string = /(?:<attribute_name>(?:\s*=\s*<attribute_value>)?)/.source;
    let attribute_name: RegExp = /(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)/;
    let attribute_value: RegExp = /(?:[^/s'"=<>`]|'[^']*'|"[^"]*")/;

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
        // processing_instruction,
        // declaration,
        // cdata,
        // tag_name,
        // attribute: new RegExp(attribute),
        // attribute_name,
        // attribute_value,
    };
}();

class NewLineRule implements Rule {
    readonly name: string = "NewLine";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^\n+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new NewLine(capturing[0]);
    };
}

class ParagraphRule implements Rule {
    readonly name: string = "Paragraph";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^(?:.(?:\n|$)?)+/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Paragraph(ctx.parseInlineElements(new StringStream(capturing[0])));
    };
}


/* *+- */

/* 1.   */
class ListBlockRule implements Rule {
    readonly name: string = "ListBlock";
    readonly description: string = "Standard Markdown Block Rule";
    public static readonly blankRegex = /^[\t\v\f ]*\n/;
    public static readonly listBlockRegex = /^([^\n]*(?:\n|$)(?:(?=[^\n0-9*+-])[^\n]*(?:\n|$))*)/;
    public static readonly replaceRegex = /^(?: {4}|\t)/gm;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let ordered: boolean;
        if ("*+-".includes(s.source[0])) {
            ordered = false;
        } else if ('0' <= s.source[0] && s.source[0] <= '9') {
            ordered = true;
        } else {
            return undefined;
        }
        return ListBlockRule.matchBlock(new ListBlock(ordered), s, ctx);
    };

    private static matchBlock(l: ListBlock, s: StringStream, ctx: RuleContext): ListBlock | undefined {
        let nextMarker: string | undefined;
        nextMarker = l.lookAhead(s);
        if (!nextMarker) {
            return undefined;
        }
        let blockContent: string, marker: string | undefined, lastSeparated = false;
        for (blockContent = '', marker = nextMarker, nextMarker = undefined;
             marker !== undefined;
             blockContent = '', marker = nextMarker, nextMarker = undefined) {
            do {
                let capturing = ListBlockRule.listBlockRegex.exec(s.source);
                if (capturing === null) {
                    throw new Error("match block failed");
                }
                forward(s, capturing);
                blockContent += capturing[0];
            } while (l.lookAhead0(s) && (nextMarker = l.lookAhead(s)) === undefined);
            let element = new ListElement(marker, ctx.parseBlockElements(
                new StringStream(blockContent.replace(ListBlockRule.replaceRegex, '')),
            ));
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


class QuotesRule implements Rule {
    readonly name: string = "Quotes";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^( *>[^\n]*(?:\n[^\n]+)*\n?)+/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Quotes(ctx.parseBlockElements(
            new StringStream(capturing[0].replace(/^ *> ?/gm, ''))
        ));
    };
}

class HorizontalRule implements Rule {
    readonly name: string = "Horizontal";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})\n?/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Horizontal();
    };
}


class CodeBlockRule implements Rule {
    readonly name: string = "CodeBlock";
    readonly description: string = "Standard Markdown Block Rule";

    public static readonly regex: RegExp = /^((?: {4}|\t)[^\n]+(\n|$))+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = CodeBlockRule.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new CodeBlock(capturing[0].replace(/^(?: {4}|\t)/gm, ''));
    };
}

class HeaderBlockRule implements Rule {
    readonly name: string = "HeaderBlock";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly atxRegex: RegExp = /^(#{1,6}) ([^\n]*?)#*(?:\n|$)/;
    public readonly setextRegex: RegExp = /^([^\n]+)\n=+(?:\n|$)/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        return this.matchATX(s, ctx) || this.matchSetext(s, ctx);
    };

    matchATX(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.atxRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new HeaderBlock(ctx.parseInlineElements(new StringStream(capturing[2])), capturing[1].length);
    }

    matchSetext(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new HeaderBlock(ctx.parseInlineElements(new StringStream(capturing[1])), 1);
    }
}

class LinkDefinitionRule implements Rule {
    readonly name: string = "LinkDefinition";
    readonly description: string = "Standard Markdown Block Rule";
    public readonly regex: RegExp = /^ *\[([^\]]+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new LinkDefinition(capturing[1], capturing[2], capturing[3]);
    };
}

class HTMLBlockRule implements Rule {
    readonly name: string = "HTMLBlock";
    readonly description: string = "Standard Markdown Block Rule";

    // public readonly singleTonRegex: RegExp = /^/;
    // public readonly stdRegex: RegExp = /^/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let ot: OpenTagRegExp = ctx.options.validTags.open_tag;
        let capturing = ot.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        if (ot.isSingleton(capturing)) {
            return new HTMLBlock(capturing[0]);
        }

        return undefined
    };
}

class InlinePlainExceptSpecialMarksRule implements Rule {
    readonly name: string = "InlinePlainExceptSpecialMarks";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:\\[<`_*\[]|[^<`_*\[])+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new InlinePlain(capturing[0]);
    };
}

class InlinePlainRule implements Rule {
    readonly name: string = "InlinePlain";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^[\s\S]+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new InlinePlain(capturing[0]);
    };
}


class LinkOrImageRule implements Rule {
    readonly name: string = "Link";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
    public readonly refRegex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\s*\[([^\]]*)]/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        return this.matchInline(s, ctx) || this.matchRef(s, ctx);
    };

    matchInline(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        if (capturing[1] !== '') {

            return new ImageLink(capturing[2], capturing[3], true, capturing[4]);
        } else {
            return new Link(capturing[2], capturing[3], true, capturing[4]);
        }
    }

    matchRef(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.refRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        if (capturing[1] !== '') {
            return new ImageLink(capturing[2], capturing[3], false);
        } else {
            return new Link(capturing[2], capturing[3], false);
        }
    }
}


class EmphasisRule implements Rule {
    readonly name: string = "Emphasis";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:(_{1,2})([^_]+?)(_{1,2})|(\*{1,2})([^*]+?)(\*{1,2}))/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        let l: string = capturing[1] || capturing[4], r: string = capturing[3] || capturing[6];
        if (l !== r) {
            if (l.length < r.length) {
                s.forward(capturing[0].length - 1);
                return new Emphasis(capturing[2] || capturing[5], l.length);
            }
            return undefined;
        }

        forward(s, capturing);
        return new Emphasis(capturing[2] || capturing[5], l.length);
    };
}


class InlineCodeRule implements Rule {
    readonly name: string = "InlineCode";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:``([^`\n\r\u2028\u2029](?:`?[^`\n\r\u2028\u2029])*)``|`([^`\n\r\u2028\u2029]+?)`)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new InlineCode(capturing[1] || capturing[2]);
    };
}


class GFMFencedCodeBlockRule implements Rule {
    readonly name: string = "GFMCodeBlock";
    readonly description: string = "GFM Markdown Block Rule";

    public static readonly backtickRegex: RegExp = /^(`{3,})([^`]*?)(?:\n|$)([^`]+)(?:\1|$)/;
    public static readonly tildeRegex: RegExp = /^(~{3,})([^~]*?)(?:\n|$)([^~]+)(?:\1|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = GFMFencedCodeBlockRule.backtickRegex.exec(s.source);
        if (capturing === null) {
            capturing = GFMFencedCodeBlockRule.tildeRegex.exec(s.source);
            if (capturing === null) {
                return undefined;
            }
        }

        forward(s, capturing);
        return new CodeBlock(capturing[3], capturing[2]);
    };
}

const inlineRules: Rule[] = [
    new InlinePlainExceptSpecialMarksRule(),
    new LinkOrImageRule(),
    new EmphasisRule(),
    new InlineCodeRule(),
    new InlinePlainRule(),
];

const blockRules: Rule[] = [
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

// noinspection JSUnusedGlobalSymbols
export function newBlockRules(enableHtml?: boolean): Rule[] {
    let rules0: Rule[] = [
        new NewLineRule(),
        new CodeBlockRule(),
        new LinkDefinitionRule(),
    ];

    let rules1: Rule[] = [
        new QuotesRule(),
        new HeaderBlockRule(),
        new HorizontalRule(),
        new ListBlockRule(),
    ];

    let rules2: Rule[] = [
        new ParagraphRule(),
    ];

    if (enableHtml) {
        rules0.push(new HTMLBlockRule());
    }

    return [...rules0, ...rules1, ...rules2];
}


export {Rule, RuleContext, validTags, inlineRules, blockRules};

export {
    InlinePlainExceptSpecialMarksRule, LinkOrImageRule, EmphasisRule, InlineCodeRule, InlinePlainRule,
};
export {
    CodeBlockRule,
    ParagraphRule,
    LinkDefinitionRule,
    QuotesRule,
    HTMLBlockRule,
    ListBlockRule,
    HorizontalRule,
    HeaderBlockRule,
};
