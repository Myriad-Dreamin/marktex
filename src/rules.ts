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
    Paragraph,
    Quotes
} from "./token";
import {StringStream} from './source';
import {HTMLTagsRegexps, OpenTagRegExp, RegExpWithTagName, RuleOptions} from "./options";


interface RuleContext {
    options: RuleOptions

    lexBlockElement(source: StringStream): BlockElement

    lexInlineElement(source: StringStream): InlineElement

    lexBlockElements(source: StringStream): BlockElement[]

    lexInlineElements(source: StringStream): InlineElement[]
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

class ParagraphRule implements Rule {
    readonly name: string = "Paragraph";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^(.+\n)+\n*/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Paragraph(ctx.lexInlineElements(new StringStream(capturing[0])));
    };
}


/* *+- */

/* 1.   */
class ListBlockRule implements Rule {
    readonly name: string = "ListBlock";
    readonly description: string = "Standard Markdown Block Rule";

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        if ("*+-".includes(s.source[0])) {
            if (s.source[1] !== ' ') {
                return undefined;
            }
            let m: string = s.source[0];

            s.forward(2);
            return this.matchUnorderedList(m, new ListBlock(false), s, ctx);
        } else if ('0' <= s.source[0] && s.source[0] <= '9') {
            return ListBlockRule.matchOrderedListNumber(s, (num) => this.matchOrderedList(num, new ListBlock(true), s, ctx));
        }
        return
    };

    private matchUnorderedList(u: string, l: ListBlock, s: StringStream, ctx: RuleContext): ListBlock {
        for (let i = 0; ; i++) {
            if (!s.source[i]) {
                l.listElements.push(new ListElement(u, ctx.lexBlockElements(
                    new StringStream(s.source.replace(/^(?: {4}|\t)/gm, '')),
                )));
                s.forward(i);
                return l;
            }

            if (s.source[i] === '\n') {
                let m: string | undefined = s.source[i + 1];
                if (!m || "*+-".includes(m)) {
                    l.listElements.push(new ListElement(u, ctx.lexBlockElements(
                        new StringStream(s.source.substr(0, i + 1).replace(/^(?: {4}|\t)/gm, '')),
                    )));
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

    private matchOrderedList(u: string, l: ListBlock, s: StringStream, ctx: RuleContext): ListBlock {
        for (let i = 0; ; i++) {
            if (!s.source[i]) {
                l.listElements.push(new ListElement(u, ctx.lexBlockElements(
                    new StringStream(s.source.replace(/^(?: {4}|\t)/gm, '')),
                )));
                s.forward(i);
                return l;
            }

            if (s.source[i] === '\n') {
                let m: string | undefined = s.source[i + 1];
                if (!m || "0123456789".includes(m)) {
                    l.listElements.push(new ListElement(u, ctx.lexBlockElements(
                        new StringStream(s.source.substr(0, i + 1).replace(/^(?: {4}|\t)/gm, '')),
                    )));
                    s.forward(i + 1);
                    if (!m) {
                        return l;
                    }

                    return ListBlockRule.matchOrderedListNumber(
                        s, (num) => this.matchOrderedList(num, l, s, ctx)) || l;
                }
            }
        }
    }

    private static matchOrderedListNumber(
        s: StringStream, callback: (num: string) => ListBlock): ListBlock | undefined {
        for (let i = 0; ; i++) {
            if (s.source[i] == '.') {
                if (s.source[i + 1] == ' ') {
                    let m: string = s.source.substr(0, i);

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


class QuotesRule implements Rule {
    readonly name: string = "Quotes";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^( *>[^\n]+(?:\n[^\n]+)*\n*)+/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Quotes(ctx.lexBlockElements(
            new StringStream(capturing[0].replace(/^ *> ?/gm, ''))
        ));
    };
}

class HorizontalRule implements Rule {
    readonly name: string = "Horizontal";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^((?:(\* *){3,}|(- *){3,})\n?)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new Horizontal();
    };
}


class CodeBlockRule implements Rule {
    readonly name: string = "CodeBlock";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^((?: {4}|\t)[^\n]+\n{0,2})+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new CodeBlock(capturing[0].replace(/^{4}|\t/gm, ''));
    };
}

class HeaderBlockRule implements Rule {
    readonly name: string = "HeaderBlock";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly atxRegex: RegExp = /^(#{1,6}) ([^#]*)#*\n?/;
    public readonly setextRegex: RegExp = /^((?: {4}|\t)[^\n]+\n{0,2})+/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        return this.matchATX(s, ctx) || this.matchSetext(s, ctx);
    };

    matchATX(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.atxRegex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new HeaderBlock(capturing[2], capturing[1].length);
    }

    matchSetext(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new HeaderBlock(capturing[1], 1);
    }
}

class LinkDefinitionRule implements Rule {
    readonly name: string = "LinkDefinitionRule";
    readonly description: string = "Standard Markdown Block Rule";
    public readonly regex: RegExp = /^/;

    // public readonly stdRegex: RegExp = /^/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        console.log("todo");
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        forward(s, capturing);
        return new LinkDefinition('', '');
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
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        if (ot.isSingleton(capturing)) {
            return new HTMLBlock(capturing[0]);
        }

        // window.console.log("");
        return undefined
    };
}

class InlinePlainExceptSpecialMarksRule implements Rule {
    readonly name: string = "InlinePlainExceptSpecialMarksRule";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:\\[<`_*\[]|[^<`_*\[])+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
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
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new InlinePlain(capturing[0]);
    };
}


class LinkOrImageRule implements Rule {
    readonly name: string = "LinkRule";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
    public readonly refRegex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\s*\[([^\]]*)]/;

    //\[([^\]]*)\]
    match(s: StringStream, ctx: RuleContext): MaybeToken {
        return this.matchInline(s, ctx) || this.matchRef(s, ctx);
    };

    matchInline(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
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
        if (capturing === undefined || capturing === null) {
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
        if (capturing === undefined || capturing === null) {
            return undefined;
        }
        let l: string = capturing[1], r: string = capturing[3];
        if (l !== r) {
            return undefined;
        }

        forward(s, capturing);
        return new Emphasis(capturing[2], l.length);
    };
}


class InlineCodeRule implements Rule {
    readonly name: string = "InlineCode";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^``([^`\n\r\u2028\u2029](?:`[^`\n\r\u2028\u2029])?)+``|`([^`\n\r\u2028\u2029]+?)`/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === undefined || capturing === null) {
            return undefined;
        }

        forward(s, capturing);
        return new InlineCode(capturing[1]);
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
    new CodeBlockRule(),
    // new LinkDefinitionRule(),
    // new HTMLBlockRule(),
    new QuotesRule(),
    new HeaderBlockRule(),
    new HorizontalRule(),
    new ListBlockRule(),
    new ParagraphRule(),
];

// noinspection JSUnusedGlobalSymbols
export function newBlockRules(enableHtml: boolean): Rule[] {
    let rules0: Rule[] = [
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
    CodeBlockRule, ParagraphRule, LinkDefinitionRule, ListBlockRule, HorizontalRule, HeaderBlockRule,
};
