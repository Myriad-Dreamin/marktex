import {Rule, RuleContext} from "./rule";
import {forwardRegexp, StringStream} from "../lib/stream";
import {
    CodeBlock,
    Emphasis,
    HeaderBlock,
    Horizontal,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlinePlain,
    Link,
    LinkDefinition,
    ListBlock,
    ListElement,
    MaybeToken,
    NewLine,
    Paragraph,
    Quotes
} from "../token/token";
import {unescapeBackSlash} from "../lib/escape";


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


export class NewLineRule implements Rule {
    readonly name: string = "Standard/Block/NewLine";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^\n+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new NewLine(capturing[0]);
    };
}

export class ParagraphRule implements Rule {
    readonly name: string = "Paragraph";
    readonly description: string = "Standard Markdown Block Rule";

    // public readonly regex: RegExp = /^(?:(?:[^$]|\$(?!\$))(?:\n|$)?)+/;

    constructor({otherBlockBegin = []}: { otherBlockBegin: string[] }) {

    }

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let lastChar: string = 'a', i = 0;
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
            } else {
                lastChar = s.source[i];
            }
        }
        if (!i) {
            return undefined;
        }
        let capturing = s.source.slice(0, i);
        s.forward(i);
        return new Paragraph(ctx.parseInlineElements(new StringStream(capturing)));
    }
}

export class QuotesRule implements Rule {
    readonly name: string = "Standard/Block/Quotes";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^( *>[^\n]*(?:\n[^\n]+)*\n?)+/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new Quotes(ctx.parseBlockElements(
            new StringStream(capturing[0].replace(/^ *> ?/gm, ''))
        ));
    };
}

export class CodeBlockRule implements Rule {
    readonly name: string = "Standard/Block/CodeBlock";
    readonly description: string = "Standard Markdown Block Rule";

    public static readonly regex: RegExp = /^((?: {4}|\t)[^\n]+(\n|$))+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = CodeBlockRule.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new CodeBlock(capturing[0].replace(/^(?: {4}|\t)/gm, ''));
    };
}

export class HeaderBlockRule implements Rule {
    readonly name: string = "Standard/Block/HeaderBlock";
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
        forwardRegexp(s, capturing);
        return new HeaderBlock(ctx.parseInlineElements(new StringStream(capturing[2])), capturing[1].length);
    }

    matchSetext(s: StringStream, ctx: RuleContext): MaybeToken {
        let capturing = this.setextRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        return new HeaderBlock(ctx.parseInlineElements(new StringStream(capturing[1])), 1);
    }
}

export class HorizontalRule implements Rule {
    readonly name: string = "Standard/Block/Horizontal";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})(?:\n|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new Horizontal();
    };
}

export class LinkDefinitionRule implements Rule {
    readonly name: string = "Standard/Block/LinkDefinition";
    readonly description: string = "Standard Markdown Block Rule";
    public readonly regex: RegExp = /^ *\[((?:\\\\|\\]|[^\]])+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        return new LinkDefinition(unescapeBackSlash(capturing[1]), capturing[2], capturing[3]);
    };
}

export class ListBlockRule implements Rule {
    readonly name: string = "Standard/Block/ListBlock";
    readonly description: string = "Standard Markdown Block Rule";
    public static readonly gfmSelectorRule = /^\s{0,3}\[([ x])]\s*/;
    //^((?:[^\n]+(?:\n|$)(?=[^0-9*+-])(\n(?=[^0-9*+-]))?)+)
    public static readonly listBlockRegex = /^(?:(?:[^\n]*)(?:\n|$)\n?)(?:(?=[^0-9*+-])(?:[^\n]+)(?:\n|$)\n?)*/;
    public static readonly replaceRegex = /^(?: {4}|\t)/gm;
    private readonly enableGFMRules: boolean;

    constructor({enableGFMRules}: { enableGFMRules?: boolean }) {
        this.enableGFMRules = enableGFMRules || false;
    }


    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let ordered: boolean;
        if ("*+-".includes(s.source[0])) {
            ordered = false;
        } else if ('0' <= s.source[0] && s.source[0] <= '9') {
            ordered = true;
        } else {
            return undefined;
        }
        return this.matchBlock(new ListBlock(ordered), s, ctx);
    };

    private matchBlock(l: ListBlock, s: StringStream, ctx: RuleContext): ListBlock | undefined {
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
                    throw s.wrapErr(new Error("match block failed"));
                }
                forwardRegexp(s, capturing);
                blockContent += capturing[0];


            } while (!s.eof && !l.lookAhead0(s) && (nextMarker = l.lookAhead(s)) === undefined);

            blockContent = blockContent.replace(ListBlockRule.replaceRegex, '');
            let sep = blockContent.endsWith('\n\n');
            if (sep) {
                blockContent = blockContent.slice(0, blockContent.length - 2);
            }

            let sub = new StringStream(blockContent);
            let selector = undefined;
            if (this.enableGFMRules) {
                let capturing = ListBlockRule.gfmSelectorRule.exec(sub.source);
                if (capturing !== null && capturing[0].length != sub.source.length) {
                    forwardRegexp(sub, capturing);
                    selector = capturing[1];
                }
            }

            let element = new ListElement(marker, ctx.parseBlockElements(
                sub,
            ), sep || lastSeparated, selector);
            l.listElements.push(element);

            lastSeparated = sep;

            if (!nextMarker) {
                if (l.lookAhead0(s)) {
                    nextMarker = l.lookAhead(s);
                }
            }
        }
        return l;
    }
}

export interface RegExpWithTagName {
    exec(string: string): RegExpExecArray | null;

    getTagName(g: RegExpExecArray): string;
}

export interface OpenTagRegExp extends RegExpWithTagName {
    isSingleton(g: RegExpExecArray): boolean;
}

export interface HTMLBlockOptions {
    open_tag?: OpenTagRegExp;
    close_tag?: RegExpWithTagName;
    others?: RegExp;
    safeHTMLTagFilter?: (tag: string) => boolean;
}

function defaultValidTags() {
    ///^<([a-zA-Z][a-zA-Z0-9-]*)(?:\s+(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:[^\/\s'"=<>`]|'[^']*'|"[^"]*"))?)*\s*(\/?)>/
    let ot: any = /^<([a-zA-Z][\w-]*)(?:\s+(?:[\w:@][\w.:-]*)(?:\s*=\s*(?:[^\/\s'"=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/?)>/;
    ///^(?:<\/((?:[a-zA-Z][a-zA-Z0-9-]*))\s*>)/
    let ct: any = /^<\/(\w+)\s*>/;

    ct.getTagName = ot.getTagName = function (g: RegExpExecArray): string {
        return g[1]
    };
    ot.isSingleton = function (g: RegExpExecArray): boolean {
        return g[2] === '/';
    };

    return {
        open_tag: ot,
        close_tag: ct,
        ///^(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)|(?:<\?(?:(?!\?>).)*\?>)|(?:<![A-Z]+[^>]*>)|(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/
        others: /^<(?:!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->|\?(?:(?!\?>)[\s\S])*\?>|![A-Z]+[^>]*>|!\[CDATA(?:(?!]]>)\s\S)*]]>)/,
    };
}

export class HTMLBlockRule implements Rule {
    readonly name: string = "Standard/Block/HTMLBlock";
    readonly description: string = "Standard Markdown Block Rule";
    protected readonly open_tag: OpenTagRegExp;
    protected readonly close_tag: RegExpWithTagName;
    protected readonly others: RegExp;
    protected readonly safeHTMLTagFilter?: (tag: string) => boolean;

    constructor(options?: HTMLBlockOptions) {
        let v = Object.assign(options || {}, defaultValidTags());
        this.open_tag = v.open_tag;
        this.close_tag = v.close_tag;
        this.others = v.others;
        this.safeHTMLTagFilter = v.safeHTMLTagFilter;
    }

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        if (s.source[0] !== '<') {
            return undefined;
        }
        return this.matchBlock(s) || this.matchOthers(s);
    }

    matchBlock(s: StringStream): MaybeToken {
        let capturing = this.filterTag(s, this.open_tag);
        if (capturing === null) {
            return undefined;
        }

        if (this.open_tag.isSingleton(capturing)) {
            forwardRegexp(s, capturing);
            return new HTMLBlock(capturing[0]);
        }

        return this.gfmStyleForward(s, capturing);
    }

    matchOthers(s: StringStream): MaybeToken {
        let capturing = this.filterTag(s, this.close_tag) || this.others.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        return this.gfmStyleForward(s, capturing);
    }

    filterTag(s: StringStream, filter: { exec(s: string): RegExpExecArray | null, getTagName(r: RegExpExecArray): string }) {

        let capturing = filter.exec(s.source);
        if (capturing === null) {
            return null;
        }
        let tag: string = filter.getTagName(capturing);
        if (this.safeHTMLTagFilter && !this.safeHTMLTagFilter(tag)) {
            return null;
        }
        return capturing;
    }

    gfmStyleForward(s: StringStream, capturing: RegExpExecArray): HTMLBlock {

        forwardRegexp(s, capturing);
        let lastChar = 'a', i = 0;
        for (; i < s.source.length; i++) {
            if (lastChar === '\n' && '\n' === s.source[i]) {
                i--;
                break;
            }
            lastChar = s.source[i];
        }

        let res = capturing[0] + s.source.slice(0, i);
        s.forward(i);
        return new HTMLBlock(res);
    }
}

export class InlinePlainExceptSpecialMarksRule implements Rule {
    readonly name: string = "Standard/Inline/InlinePlainExceptSpecialMarks";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:\\[!`_*\[$\\]|[^<!`_*\[$\\])+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(unescapeBackSlash(capturing[0]));
    };
}

export class InlinePlainRule implements Rule {
    readonly name: string = "Standard/Inline/InlinePlain";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:[!`_*\[$\\<](?:\\[!`_*\[$\\]|[^<!`_*\[$\\])*|(?:\\[!`_*\[$\\]|[^<!`_*\[$\\])+)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(unescapeBackSlash(capturing[0]));
    };
}

export class LinkOrImageRule implements Rule {
    readonly name: string = "Standard/Inline/Link";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
    public readonly refRegex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\[((?:\\\\|\\]|[^\]])*)]/;
    public readonly autoLinkRegex: RegExp =
        /^<(?:(?:mailto|MAILTO):([\w.!#$%&'*+\/=?^`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)|([a-zA-Z][a-zA-Z\d+.-]{1,31}:[^<>\s]*))>/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        return this.matchInline(s, ctx) || this.matchAutoLink(s, ctx) || this.matchRef(s, ctx);
    };

    matchInline(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        if (capturing[1] !== '') {

            return new ImageLink(unescapeBackSlash(capturing[2]), capturing[3], true, capturing[4]);
        } else {
            return new Link(unescapeBackSlash(capturing[2]), capturing[3], true, capturing[4]);
        }
    }

    matchAutoLink(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.autoLinkRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        if (capturing[1] !== undefined) {
            return new Link(capturing[1], 'mailto:' + capturing[1], true);
        } else {
            return new Link(capturing[2], capturing[2], true);
        }
    }

    matchRef(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.refRegex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        if (capturing[1] !== '') {
            return new ImageLink(capturing[2], capturing[3], false);
        } else {
            return new Link(capturing[2], capturing[3], false);
        }
    }
}

export class EmphasisRule implements Rule {
    readonly name: string = "Standard/Inline/Emphasis";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:(_{1,2})((?:\\\\|\\_|[^_])+)(_{1,2})|(\*{1,2})((?:\\\\|\\\*|[^*])+)(\*{1,2}))/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        let l: string = capturing[1] || capturing[4], r: string = capturing[3] || capturing[6];
        if (l !== r) {
            if (l.length < r.length) {
                s.forward(capturing[0].length - 1);
                return new Emphasis(unescapeBackSlash(capturing[2] || capturing[5]), l.length);
            }
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new Emphasis(unescapeBackSlash(capturing[2] || capturing[5]), l.length);
    };
}

export class InlineCodeRule implements Rule {
    readonly name: string = "Standard/Inline/InlineCode";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:``([^`\n\r\u2028\u2029](?:\\\\|\\`|`?[^`\n\r\u2028\u2029])*)``|`((?:\\\\|\\`|[^`\n\r\u2028\u2029])+)`)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlineCode(unescapeBackSlash(capturing[1] || capturing[2]));
    };
}
