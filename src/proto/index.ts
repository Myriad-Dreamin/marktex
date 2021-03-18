import {StringStream} from "../lib/stream";
import {commandFunc, LaTeXParser, TexContext} from "../parser/tex-parser";
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
    Token
} from "../token/token";
import {Parser} from "../parser/parser";

export interface RenderContext<TexExtends = any> {
    readonly driver: IRenderDriverInner;
    readonly render: IRenderer;
    readonly parser: Parser;
    readonly latexParser: LaTeXParser;
    readonly next: () => void;
    readonly tokens: Token[];

    linkDefs: { [linkIdentifier: string]: LinkDefinition };
    html: string;
    texCtx: TexContext<TexExtends>;
}

export interface IRenderDriverInner {
    renderElement(ctx: RenderContext, el: Token): void;

    renderElements(ctx: RenderContext, elements: Token[]): void;
}

export interface IRenderDriver extends IRenderDriverInner {
    render(s: StringStream, mdFieldTexCommands?: { [cn: string]: commandFunc }): string;

    renderString(s: string, mdFieldTexCommands?: { [cn: string]: commandFunc }): string;

    // appendMiddleware(middleware: RenderMiddleware): void;
}

export interface IRenderHook {
    initContext?: (ctx: RenderContext) => void;
}

export interface IRenderer extends IRenderHook {
    renderQuotes(ctx: RenderContext, quotesEl: Quotes): void;

    renderHorizontal(ctx: RenderContext, horizontalEl: Horizontal): void;

    renderLinkDefinition(ctx: RenderContext, linkDefinitionEl: LinkDefinition): void;

    renderInlinePlain(ctx: RenderContext, inlinePlainEl: InlinePlain): void;

    renderLink(ctx: RenderContext, linkEl: Link): void;

    renderImageLink(ctx: RenderContext, imageLinkEl: ImageLink): void;

    renderEmphasis(ctx: RenderContext, emphasisEl: Emphasis): void;

    renderInlineCode(ctx: RenderContext, inlineCodeEl: InlineCode): void;

    renderParagraph(ctx: RenderContext, paragraphEl: Paragraph): void;

    renderListBlock(ctx: RenderContext, listBlockEl: ListBlock): void;

    renderCodeBlock(ctx: RenderContext, codeBlockEl: CodeBlock): void;

    renderHTMLBlock(ctx: RenderContext, htmlBlockEl: HTMLBlock): void;

    renderMathBlock(ctx: RenderContext, mathBlockEl: MathBlock): void;

    renderLatexBlock(ctx: RenderContext, latexBlockEl: LaTeXBlock): void;

    renderHeaderBlock(ctx: RenderContext, headerBlockEl: HeaderBlock): void;

    renderNewLine(ctx: RenderContext, newLineEl: NewLine): void;
}
