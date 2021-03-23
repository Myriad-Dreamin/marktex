import {Parser} from "../parser/parser";
import {StringStream} from '../lib/stream';
import {commandFunc, LaTeXParser, texCommands} from "../parser/tex-parser";
import {
    CodeBlock,
    Emphasis,
    HeaderBlock,
    Horizontal,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlinePlain,
    LaTeXBlock,
    Link,
    LinkDefinition,
    ListBlock,
    MathBlock,
    NewLine,
    Paragraph,
    Quotes,
    Token,
    TokenType
} from "../token/token";
import {IRenderDriver, IRenderer, RenderContext} from "../proto";

export type RenderMiddleware = (ctx: RenderContext) => void;

export interface RenderDriverOptions {
    originStack?: RenderMiddleware[],
}

export class RenderDriver implements IRenderDriver {
    protected renderer: IRenderer;
    protected parser: Parser;
    protected latexParser: LaTeXParser;
    protected texCommands: { [p: string]: commandFunc };
    private readonly stack: RenderMiddleware[];

    constructor(
        parser: Parser,
        renderer: IRenderer,
        opts?: RenderDriverOptions) {
        this.parser = parser;
        this.renderer = renderer;
        this.latexParser = new LaTeXParser();
        this.texCommands = texCommands;
        this.stack = opts?.originStack || [this.createLinkMap, this.handleElements, this.mergeOneLineParagraph];
    }

    // noinspection JSUnusedGlobalSymbols
    addMiddleware(middleware: RenderMiddleware) {
        this.stack.push(middleware);
    }

    createLinkMap(ctx: RenderContext): void {
        for (let el of ctx.tokens) {
            if (el.token_type === TokenType.LinkDefinition) {
                let linkDef: LinkDefinition = <LinkDefinition>el;
                ctx.linkDefs[linkDef.linkIdentifier] = linkDef;
            }
        }
    }

    handleElements(ctx: RenderContext): void {
        ctx.driver.renderElements(ctx, ctx.tokens);
    }

    mergeOneLineParagraph(ctx: RenderContext): void {
        
    }

    render(s: StringStream, mdFieldTexCommands?: { [cn: string]: commandFunc }): string {
        let stackIndex: number = 0;
        const stack = this.stack;
        let ctx: RenderContext = {
            linkDefs: {},
            html: '',
            driver: this,
            render: this.renderer,
            parser: this.parser,
            latexParser: this.latexParser,
            tokens: this.parser.parseBlockElements(s),

            texCtx: {
                texCommands: this.texCommands,
                texCommandDefs: mdFieldTexCommands || {},
            },
            next() {
                for (; stackIndex < stack.length;) {
                    stack[stackIndex++](ctx);
                }
            }
        };
        if (this.renderer.initContext) {
            this.renderer.initContext(ctx);
        }
        ctx.next();
        return ctx.html;
    }

    renderString(s: string, mdFieldTexCommands?: { [cn: string]: commandFunc }): string {
        return this.render(new StringStream(s), mdFieldTexCommands);
    }

    renderElements(ctx: RenderContext, elements: Token[]) {
        for (let el of elements) {
            ctx.driver.renderElement(ctx, el);
        }
    }

    renderElement(ctx: RenderContext, el: Token) {
        switch (el.token_type) {
            case TokenType.Paragraph:
                ctx.render.renderParagraph(ctx, <Paragraph>el);
                break;
            case TokenType.NewLine:
                ctx.render.renderNewLine(ctx, <NewLine>el);
                break;
            case TokenType.Quotes:
                ctx.render.renderQuotes(ctx, <Quotes>el);
                break;
            case TokenType.ListBlock:
                ctx.render.renderListBlock(ctx, <ListBlock>el);
                break;
            case TokenType.Horizontal:
                ctx.render.renderHorizontal(ctx, <Horizontal>el);
                break;
            case TokenType.LinkDefinition:
                ctx.render.renderLinkDefinition(ctx, <LinkDefinition>el);
                break;
            case TokenType.CodeBlock:
                ctx.render.renderCodeBlock(ctx, <CodeBlock>el);
                break;
            // can latex
            case TokenType.HTMLBlock:
                ctx.render.renderHTMLBlock(ctx, <HTMLBlock>el);
                break;
            case TokenType.HeaderBlock:
                ctx.render.renderHeaderBlock(ctx, <HeaderBlock>el);
                break;
            // can latex
            case TokenType.InlinePlain:
                ctx.render.renderInlinePlain(ctx, <InlinePlain>el);
                break;
            // can latex
            case TokenType.Link:
                ctx.render.renderLink(ctx, <Link>el);
                break;
            case TokenType.ImageLink:
                ctx.render.renderImageLink(ctx, <ImageLink>el);
                break;
            case TokenType.MathBlock:
                ctx.render.renderMathBlock(ctx, <MathBlock>el);
                break;
            case TokenType.LatexBlock:
                ctx.render.renderLatexBlock(ctx, <LaTeXBlock>el);
                break;
            // can latex
            case TokenType.Emphasis:
                ctx.render.renderEmphasis(ctx, <Emphasis>el);
                break;
            case TokenType.InlineCode:
                ctx.render.renderInlineCode(ctx, <InlineCode>el);
                break;
            default:
                throw new Error(`invalid Token Type: ${el.token_type}`);
        }
    }
}
