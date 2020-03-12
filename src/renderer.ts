import {Parser} from "./parser";
import {StringStream} from "./source";
import {
    BlockElement,
    CodeBlock,
    Emphasis,
    HeaderBlock,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlinePlain,
    Link,
    LinkDefinition,
    ListBlock,
    Paragraph,
    Quotes,
    Token,
    TokenType
} from "./token";

interface RenderContext {
    readonly render: Renderer,
    readonly next: () => void,
    readonly tokens: Token[],

    linkDefs: { [linkIdentifier: string]: LinkDefinition },
    html: string,
}

type RenderMiddleware = (ctx: RenderContext) => void;

interface RenderOptions {
    originStack?: RenderMiddleware[],
}

class Renderer {
    protected parser: Parser;
    private stack: RenderMiddleware[];

    public constructor(parser: Parser, renderOptions: RenderOptions) {
        this.parser = parser;
        this.stack = renderOptions.originStack || [this.createLinkMap, this.handleElements];
    }

    // noinspection JSUnusedGlobalSymbols
    public addMiddleware(middleware: RenderMiddleware) {
        this.stack.push(middleware);
    }

    // noinspection JSUnusedGlobalSymbols
    public render(s: StringStream): string {
        let stackIndex: number = 0;
        let ctx: RenderContext = {
            render: this, tokens: this.parser.parseBlockElements(s), linkDefs: {}, html: '', next() {
                for (; stackIndex < ctx.render.stack.length;) {
                    ctx.render.stack[stackIndex++](ctx);
                }
            }
        };
        ctx.next();
        return ctx.html;
    }

    public renderElements(ctx: RenderContext, elements: Token[]) {
        for (let el of elements) {
            ctx.render.handleElement(ctx, el);
        }
    }

    public createLinkMap(ctx: RenderContext) {
        for (let el of ctx.tokens) {
            if (el.token_type === TokenType.LinkDefinition) {
                let linkDef: LinkDefinition = <LinkDefinition>el;
                ctx.linkDefs[linkDef.linkIdentifier] = linkDef;
            }
        }
    }

    protected handleElements(ctx: RenderContext) {
        for (let el of ctx.tokens) {
            ctx.render.handleElement(ctx, el);
        }
    }

    public handleElement(ctx: RenderContext, el: BlockElement) {
        switch (el.token_type) {
            case TokenType.Paragraph:
                this.renderParagraph(ctx, el);
                break;
            case TokenType.NewLine:
                this.renderNewLine(ctx, el);
                break;
            case TokenType.Quotes:
                this.renderQuotes(ctx, el);
                break;
            case TokenType.ListBlock:
                this.renderListBlock(ctx, el);
                break;
            case TokenType.Horizontal:
                this.renderHorizontal(ctx, el);
                break;
            case TokenType.LinkDefinition:
                this.renderLinkDefinition(ctx, el);
                break;
            case TokenType.CodeBlock:
                this.renderCodeBlock(ctx, el);
                break;
            case TokenType.HTMLBlock:
                this.renderHTMLBlock(ctx, el);
                break;
            case TokenType.HeaderBlock:
                this.renderHeaderBlock(ctx, el);
                break;
            case TokenType.InlinePlain:
                this.renderInlinePlain(ctx, el);
                break;
            case TokenType.Link:
                this.renderLink(ctx, el);
                break;
            case TokenType.ImageLink:
                this.renderImageLink(ctx, el);
                break;
            case TokenType.Emphasis:
                this.renderEmphasis(ctx, el);
                break;
            case TokenType.InlineCode:
                this.renderInlineCode(ctx, el);
                break;
            default:
                throw new Error(`invalid Token Type: ${el.token_type}`);
        }


    }

    protected renderParagraph(ctx: RenderContext, el: BlockElement) {
        ctx.html += '<p>';
        ctx.render.renderElements(ctx, (<Paragraph>el).inlineElements);
        ctx.html += '</p>';
    }

    protected renderNewLine(_: RenderContext, __: BlockElement) {
        // ignore it
    }

    protected renderQuotes(ctx: RenderContext, el: BlockElement) {
        ctx.html += '<blockquote>';
        ctx.render.renderElements(ctx, (<Quotes>el).insideTokens);
        ctx.html += '</blockquote>';
    }

    protected renderListBlock(ctx: RenderContext, el: BlockElement) {
        let listBlock: ListBlock = <ListBlock>el;
        ctx.html += '<' + (listBlock.ordered ? 'ol' : 'ul') + '>';
        for (let listEl of listBlock.listElements) {
            // omitting listEl.blankSeparated
            ctx.html += '<li>';
            ctx.render.renderElements(ctx, listEl.innerBlocks);
            ctx.html += '</li>';
        }
        ctx.html += '</' + (listBlock.ordered ? 'ol' : 'ul') + '>';
    }

    protected renderHorizontal(ctx: RenderContext, _: BlockElement) {
        ctx.html += "<hr/>";
    }

    protected renderLinkDefinition(_: RenderContext, __: BlockElement) {
        // ignore it
    }

    protected renderCodeBlock(ctx: RenderContext, el: BlockElement) {
        ctx.html += '<pre><code>' +
            (<CodeBlock>(el)).body +
            +'</pre></code>';
    }

    protected renderHTMLBlock(ctx: RenderContext, el: BlockElement) {
        ctx.html += (<HTMLBlock>(el)).body;
    }

    protected renderHeaderBlock(ctx: RenderContext, el: BlockElement) {
        let headerBlock: HeaderBlock = <HeaderBlock>el;
        ctx.html += "<h" + headerBlock.level + ">";
        ctx.render.renderElements(ctx, headerBlock.inlineElements);
        ctx.html += "</h" + headerBlock.level + ">";
    }

    protected renderInlinePlain(ctx: RenderContext, el: BlockElement) {
        ctx.html += (<InlinePlain>(el)).content;
    }

    protected renderLink(ctx: RenderContext, el: BlockElement) {
        let link: Link = <Link>el;
        if (!link.inlineOrReference) {
            if (ctx.linkDefs.hasOwnProperty(link.link)) {
                link.link = ctx.linkDefs[link.link].url;
                link.inlineOrReference = true;
            }
        }

        ctx.html += '<a href="' + link.link + '"';
        if (link.title) {
            ctx.html += ' title="' + link.title + '"';
        }
        ctx.html += '>' + link.linkTitle + '</a>';
    }

    protected renderImageLink(ctx: RenderContext, el: BlockElement) {
        let link: ImageLink = <ImageLink>el;
        if (!link.inlineOrReference) {
            if (ctx.linkDefs.hasOwnProperty(link.link)) {
                link.link = ctx.linkDefs[link.link].url;
                link.inlineOrReference = true;
            }
        }

        ctx.html += '<img src="' + link.link + '"' + '" alt="' + link.linkTitle + '"' +
            (link.title ? ' title="' + link.title + '"' : '') +
            "/>";

    }

    protected renderEmphasis(ctx: RenderContext, el: BlockElement) {
        let emphasisEl: Emphasis = <Emphasis>el;
        ctx.html += (emphasisEl.level === 2 ? '<strong>' : '<em>') + emphasisEl.content +
            (emphasisEl.level === 2 ? '</strong>' : '</em>');
    }

    protected renderInlineCode(ctx: RenderContext, el: BlockElement) {
        ctx.html += '<code>' + (<InlineCode>el).content + '</code>';
    }
}


export {Renderer}

