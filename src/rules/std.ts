import {Rule, RuleContext} from "./rule";
import {forwardRegexp, StringStream} from "../source";
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
    Quotes
} from "../token";

export class CodeBlockRule implements Rule {
    readonly name: string = "CodeBlock";
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
    readonly name: string = "Horizontal";
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

export class HTMLBlockRule implements Rule {
    readonly name: string = "HTMLBlock";
    readonly description: string = "Standard Markdown Block Rule";
    private validTags: HTMLTagsRegexps;

    constructor(validTags: HTMLTagsRegexps) {
        this.validTags = validTags;
    }


    // public readonly singleTonRegex: RegExp = /^/;
    // public readonly stdRegex: RegExp = /^/;

    match(s: StringStream, ctx: RuleContext): MaybeToken {
        let ot: OpenTagRegExp = this.validTags.open_tag;
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

export class InlinePlainExceptSpecialMarksRule implements Rule {
    readonly name: string = "InlinePlainExceptSpecialMarks";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(capturing[0]);
    };
}

export class InlinePlainRule implements Rule {
    readonly name: string = "InlinePlain";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:[<`_*\[$\\](?:\\[<`_*\[$\\]|[^<`_*\[$\\])*|(?:\\[<`_*\[$\\]|[^<`_*\[$\\])+)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlinePlain(capturing[0]);
    };
}

export class LinkDefinitionRule implements Rule {
    readonly name: string = "LinkDefinition";
    readonly description: string = "Standard Markdown Block Rule";
    public readonly regex: RegExp = /^ *\[([^\]]+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }
        forwardRegexp(s, capturing);
        return new LinkDefinition(capturing[1], capturing[2], capturing[3]);
    };
}

export class ListBlockRule implements Rule {
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
                forwardRegexp(s, capturing);
                blockContent += capturing[0];
            } while (l.lookAhead0(s) && (nextMarker = l.lookAhead(s)) === undefined);
            let element = new ListElement(marker, ctx.parseBlockElements(
                new StringStream(blockContent.replace(ListBlockRule.replaceRegex, '')),
            ));
            if (!nextMarker) {
                let capturing = ListBlockRule.blankRegex.exec(s.source);
                if (capturing !== null) {
                    forwardRegexp(s, capturing);
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

export class NewLineRule implements Rule {
    readonly name: string = "NewLine";
    readonly description: string = "Standard Markdown Block Rule";

    public readonly regex: RegExp = /^\s+/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new NewLine(capturing[0]);
    };
}

export class QuotesRule implements Rule {
    readonly name: string = "Quotes";
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

export class LinkOrImageRule implements Rule {
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
        forwardRegexp(s, capturing);
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
        forwardRegexp(s, capturing);
        if (capturing[1] !== '') {
            return new ImageLink(capturing[2], capturing[3], false);
        } else {
            return new Link(capturing[2], capturing[3], false);
        }
    }
}

export class EmphasisRule implements Rule {
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

        forwardRegexp(s, capturing);
        return new Emphasis(capturing[2] || capturing[5], l.length);
    };
}

export class InlineCodeRule implements Rule {
    readonly name: string = "InlineCode";
    readonly description: string = "Standard Markdown Inline Rule";

    public readonly regex: RegExp = /^(?:``([^`\n\r\u2028\u2029](?:`?[^`\n\r\u2028\u2029])*)``|`([^`\n\r\u2028\u2029]+?)`)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = this.regex.exec(s.source);
        if (capturing === null) {
            return undefined;
        }

        forwardRegexp(s, capturing);
        return new InlineCode(capturing[1] || capturing[2]);
    };
}