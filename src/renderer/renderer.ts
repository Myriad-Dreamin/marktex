import {Parser, StringStream} from "..";
import {
    BlockElement,
    CodeBlock,
    Emphasis,
    HeaderBlock,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlinePlain,
    LateXBlock,
    Link,
    LinkDefinition,
    ListBlock,
    MathBlock,
    Paragraph,
    Quotes,
    Token,
    TokenType
} from "../token/token";
import {commandFunc, LaTeXParser, texCommands, TexContext} from "../parser/tex-parser";
import {escapeHTML} from "../lib/escape";

export type HighlightFunc = (code: string, language: string) => string;

export interface RenderContext {
    readonly render: Renderer;
    readonly next: () => void;
    readonly tokens: Token[];

    linkDefs: { [linkIdentifier: string]: LinkDefinition };
    html: string;
    texCtx: TexContext;
}

export type RenderMiddleware = (ctx: RenderContext) => void;


export interface RenderOptions {
    originStack?: RenderMiddleware[],
    wrapCodeClassTag?: (language: string) => string,
    highlight?: HighlightFunc,
    enableLaTeX?: boolean,
}

export class Renderer {
    protected parser: Parser;
    private stack: RenderMiddleware[];
    private readonly texCommands: { [p: string]: commandFunc };
    private latexParser: LaTeXParser;

    protected highlight?: HighlightFunc;
    protected enableLaTeX?: boolean;

    public constructor(parser: Parser, opts?: RenderOptions) {
        this.parser = parser;
        this.stack = opts?.originStack || [this.createLinkMap, this.handleElements];
        this.highlight = function (code: string, _: string): string {
            return code;
        };
        if (opts) {
            this.highlight = opts.highlight;
            this.enableLaTeX = opts.enableLaTeX;

            if (opts.wrapCodeClassTag) {
                this.wrapCodeClassTag = opts.wrapCodeClassTag;
            }
        }
        this.texCommands = texCommands;
        this.latexParser = new LaTeXParser();
    }

    // noinspection JSUnusedGlobalSymbols
    public addMiddleware(middleware: RenderMiddleware) {
        this.stack.push(middleware);
    }

    // noinspection JSUnusedGlobalSymbols
    public render(s: StringStream, mdFieldTexCommands?: { [cn: string]: commandFunc }): string {
        let stackIndex: number = 0;
        let ctx: RenderContext = {
            render: this, tokens: this.parser.parseBlockElements(s), linkDefs: {}, html: '', texCtx: {
                texCommands: this.texCommands,
                texCommandDefs: mdFieldTexCommands || {},
            }, next() {
                for (; stackIndex < ctx.render.stack.length;) {
                    ctx.render.stack[stackIndex++](ctx);
                }
            }
        };
        ctx.next();
        return ctx.html;
    }

    // noinspection JSUnusedGlobalSymbols
    public renderString(s: string): string {
        return this.render(new StringStream(s));
    }

    public renderElements(ctx: RenderContext, elements: Token[]) {
        for (let el of elements) {
            ctx.render.handleElement(ctx, el);
        }
    }

    protected createLinkMap(ctx: RenderContext) {
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

    protected handleElement(ctx: RenderContext, el: BlockElement) {
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
            // can latex
            case TokenType.HTMLBlock:
                this.renderHTMLBlock(ctx, el);
                break;
            case TokenType.HeaderBlock:
                this.renderHeaderBlock(ctx, el);
                break;
            // can latex
            case TokenType.InlinePlain:
                this.renderInlinePlain(ctx, el);
                break;
            // can latex
            case TokenType.Link:
                this.renderLink(ctx, el);
                break;
            case TokenType.ImageLink:
                this.renderImageLink(ctx, el);
                break;
            case TokenType.MathBlock:
                this.renderMathBlock(ctx, el);
                break;
            case TokenType.LatexBlock:
                this.renderLatexBlock(ctx, el);
                break;
            // can latex
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

    public wrapCodeClassTag(language: string): string {
        return 'lang-' + language;
    }

    protected renderCodeBlock(ctx: RenderContext, el: BlockElement) {
        let codeBlock: CodeBlock = <CodeBlock>(el);
        if (codeBlock.language && this.highlight) {
            codeBlock.body = this.highlight(codeBlock.body, codeBlock.language);
        }

        ctx.html += '<pre><code' +
            (codeBlock.language ? (' class="' + escapeHTML(this.wrapCodeClassTag(codeBlock.language)) + '"') : '') + '>' +
            escapeHTML((<CodeBlock>(el)).body) + '</code></pre>';
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
        ctx.texCtx.underMathEnv = false;
        ctx.html += this.enableLaTeX ?
            this.latexParser.tex(ctx.texCtx, new StringStream((<InlinePlain>(el)).content)) :
            escapeHTML((<InlinePlain>(el)).content);
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
            ctx.html += ' title="' + escapeHTML(link.title) + '"';
        }
        ctx.texCtx.underMathEnv = false;
        ctx.html += '>' + (
            (this.enableLaTeX ? this.latexParser.tex(ctx.texCtx, new StringStream(link.linkTitle)) :
                escapeHTML(link.linkTitle))) + '</a>';
    }

    protected renderImageLink(ctx: RenderContext, el: BlockElement) {
        let link: ImageLink = <ImageLink>el;
        if (!link.inlineOrReference) {
            if (ctx.linkDefs.hasOwnProperty(link.link)) {
                link.link = ctx.linkDefs[link.link].url;
                link.inlineOrReference = true;
            }
        }

        ctx.html += '<img src="' + link.link + '"' + '" alt="' + escapeHTML(link.linkTitle) + '"' +
            (link.title ? ' title="' + escapeHTML(link.title) + '"' : '') +
            "/>";
    }

    protected renderMathBlock(ctx: RenderContext, el: BlockElement) {
        let mathBlock: MathBlock = <MathBlock>el;
        ctx.texCtx.underMathEnv = true;
        ctx.html += '<script type="math/tex' + (mathBlock.inline ? '' : '; mode=display') + '">' + (
            this.enableLaTeX ? this.latexParser.tex(ctx.texCtx, new StringStream(mathBlock.content)) :
                mathBlock.content) + '</script>';
    }

    protected renderLatexBlock(ctx: RenderContext, el: BlockElement) {
        let latexBlock: LateXBlock = <LateXBlock>el;
        ctx.texCtx.underMathEnv = false;
        ctx.html += this.latexParser.tex(ctx.texCtx, new StringStream(latexBlock.content));
    }

    protected renderEmphasis(ctx: RenderContext, el: BlockElement) {
        let emphasisEl: Emphasis = <Emphasis>el;
        ctx.texCtx.underMathEnv = false;
        ctx.html += (emphasisEl.level === 2 ? '<strong>' : '<em>') +
            (this.enableLaTeX ? this.latexParser.tex(ctx.texCtx, new StringStream(emphasisEl.content)) :
                escapeHTML(emphasisEl.content)) +
            (emphasisEl.level === 2 ? '</strong>' : '</em>');
    }

    protected renderInlineCode(ctx: RenderContext, el: BlockElement) {
        ctx.html += '<code>' + escapeHTML((<InlineCode>el).content) + '</code>';
    }
}

