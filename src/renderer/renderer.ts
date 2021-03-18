import {StringStream} from "..";
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
    ListBlock,
    MathBlock,
    Paragraph,
    Quotes
} from "../token/token";
import {escapeHTML} from "../lib/escape";
import {IRenderer, RenderContext} from "../proto";

export type HighlightFunc = (code: string, language: string) => string;


export interface RenderOptions {
    wrapCodeClassTag?: (language: string) => string,
    highlight?: HighlightFunc,
    enableLaTeX?: boolean,
}

export class Renderer implements IRenderer {
    protected highlight?: HighlightFunc;
    protected enableLaTeX?: boolean;

    public constructor(opts?: RenderOptions) {
        if (opts) {
            this.highlight = opts.highlight;
            this.enableLaTeX = opts.enableLaTeX;

            if (opts.wrapCodeClassTag) {
                this.wrapCodeClassTag = opts.wrapCodeClassTag;
            }
        }
    }

    renderParagraph(ctx: RenderContext, paragraphEl: Paragraph) {
        ctx.html += '<p>';
        ctx.driver.renderElements(ctx, paragraphEl.inlineElements);
        ctx.html += '</p>';
    }

    renderQuotes(ctx: RenderContext, quotesEl: Quotes) {
        ctx.html += '<blockquote>';
        ctx.driver.renderElements(ctx, quotesEl.insideTokens);
        ctx.html += '</blockquote>';
    }

    renderListBlock(ctx: RenderContext, listBlockEl: ListBlock) {
        ctx.html += '<' + (listBlockEl.ordered ? 'ol' : 'ul') + '>';
        for (let listEl of listBlockEl.listElements) {
            // omitting listEl.lineBreakAttached
            ctx.html += '<li>';
            ctx.driver.renderElements(ctx, listEl.innerBlocks);
            ctx.html += '</li>';
        }
        ctx.html += '</' + (listBlockEl.ordered ? 'ol' : 'ul') + '>';
    }

    renderHorizontal(ctx: RenderContext, _: Horizontal) {
        ctx.html += "<hr/>";
    }

    renderNewLine() {
        // ignore it
    }

    renderLinkDefinition() {
        // ignore it
    }

    public wrapCodeClassTag(language: string): string {
        return 'lang-' + language;
    }

    renderCodeBlock(ctx: RenderContext, codeBlockEl: CodeBlock) {
        if (this.highlight) {
            codeBlockEl.body = this.highlight(codeBlockEl.body, codeBlockEl.language || '');
        } else {
            codeBlockEl.body = escapeHTML(codeBlockEl.body);
        }

        ctx.html += '<pre><code' +
            (codeBlockEl.language ? (' class="' + escapeHTML(this.wrapCodeClassTag(codeBlockEl.language)) + '"') : '') + '>' +
            codeBlockEl.body + '</code></pre>';
    }

    renderHTMLBlock(ctx: RenderContext, htmlBlockEl: HTMLBlock) {
        ctx.html += htmlBlockEl.body;
    }

    renderHeaderBlock(ctx: RenderContext, headerBlockEl: HeaderBlock) {
        ctx.html += "<h" + headerBlockEl.level + ">";
        ctx.driver.renderElements(ctx, headerBlockEl.inlineElements);
        ctx.html += "</h" + headerBlockEl.level + ">";
    }

    renderInlinePlain(ctx: RenderContext, inlinePlainEl: InlinePlain) {
        ctx.texCtx.underMathEnv = false;
        ctx.html += this.enableLaTeX ?
            ctx.latexParser.tex(ctx.texCtx, new StringStream(inlinePlainEl.content)) :
            escapeHTML(inlinePlainEl.content);
    }

    renderLink(ctx: RenderContext, linkEl: Link) {
        if (!linkEl.inlineOrReference) {
            if (ctx.linkDefs.hasOwnProperty(linkEl.link)) {
                linkEl.link = ctx.linkDefs[linkEl.link].url;
                linkEl.inlineOrReference = true;
            }
        }

        ctx.html += '<a href="' + linkEl.link + '"';
        if (linkEl.title) {
            ctx.html += ' title="' + escapeHTML(linkEl.title) + '"';
        }
        ctx.texCtx.underMathEnv = false;
        ctx.html += '>' + (
            (this.enableLaTeX ? ctx.latexParser.tex(ctx.texCtx, new StringStream(linkEl.linkTitle)) :
                escapeHTML(linkEl.linkTitle))) + '</a>';
    }

    renderImageLink(ctx: RenderContext, imageLinkEl: ImageLink) {
        if (!imageLinkEl.inlineOrReference) {
            if (ctx.linkDefs.hasOwnProperty(imageLinkEl.link)) {
                imageLinkEl.link = ctx.linkDefs[imageLinkEl.link].url;
                imageLinkEl.inlineOrReference = true;
            }
        }

        ctx.html += '<img src="' + imageLinkEl.link + '"' + '" alt="' + escapeHTML(imageLinkEl.linkTitle) + '"' +
            (imageLinkEl.title ? ' title="' + escapeHTML(imageLinkEl.title) + '"' : '') +
            "/>";
    }

    renderMathBlock(ctx: RenderContext, mathBlockEl: MathBlock) {
        ctx.texCtx.underMathEnv = true;
        ctx.html += '<script type="math/tex' + (mathBlockEl.inline ? '' : '; mode=display') + '">' + (
            this.enableLaTeX ? ctx.latexParser.tex(ctx.texCtx, new StringStream(mathBlockEl.content)) :
                mathBlockEl.content) + '</script>';
    }

    renderLatexBlock(ctx: RenderContext, latexBlockEl: LaTeXBlock) {
        ctx.texCtx.underMathEnv = false;
        ctx.html += ctx.latexParser.tex(ctx.texCtx, new StringStream(latexBlockEl.content));
    }

    renderEmphasis(ctx: RenderContext, emphasisEl: Emphasis) {
        ctx.texCtx.underMathEnv = false;
        ctx.html += (emphasisEl.level === 2 ? '<strong>' : '<em>') +
            (this.enableLaTeX ? ctx.latexParser.tex(ctx.texCtx, new StringStream(emphasisEl.content)) :
                escapeHTML(emphasisEl.content)) +
            (emphasisEl.level === 2 ? '</strong>' : '</em>');
    }

    renderInlineCode(ctx: RenderContext, inlineCodeEl: InlineCode) {
        ctx.html += '<code>' + escapeHTML(inlineCodeEl.content) + '</code>';
    }
}

interface LaTeXRendererExt {
    sectionCounter: number;
    ssCsCounter?: number;
    subsectionCounter: number;

    renderStack: string[];
}

export class LaTeXRenderer extends Renderer implements IRenderer {

    public constructor(opts?: RenderOptions) {
        super(opts);
    }

    initContext(ctx: RenderContext<LaTeXRendererExt>) {
        ctx.texCtx.sectionCounter = 0;
        ctx.texCtx.subsectionCounter = 0;
        ctx.texCtx.ssCsCounter = undefined;
        ctx.texCtx.renderStack = [];
    }

    renderHeaderBlock(ctx: RenderContext<LaTeXRendererExt>, headerBlockEl: HeaderBlock) {
        ctx.html += "<h" + headerBlockEl.level + '>';
        // todo: section => h[optK], subsection => h[optKK]
        if (headerBlockEl.level === 1) {
            ctx.texCtx.sectionCounter++;
            ctx.html += '<span class="section-number">' + ctx.texCtx.sectionCounter.toString() + '</span>';
        } else if (headerBlockEl.level === 3) {
            // undefined => 0
            if (ctx.texCtx.ssCsCounter != ctx.texCtx.sectionCounter) {
                ctx.texCtx.subsectionCounter = 0;
                ctx.texCtx.ssCsCounter = ctx.texCtx.sectionCounter;
            }
            ctx.texCtx.subsectionCounter++;
            ctx.html += '<span class="section-number">' + ctx.texCtx.sectionCounter.toString()
                + '.' + ctx.texCtx.subsectionCounter.toString() + '</span>';
        }
        ctx.driver.renderElements(ctx, headerBlockEl.inlineElements);
        ctx.html += "</h" + headerBlockEl.level + ">";
    }

    renderParagraph(ctx: RenderContext<LaTeXRendererExt>, paragraphEl: Paragraph) {
        ctx.html += '<p>';
        if (!(ctx.texCtx.renderStack && ctx.texCtx.renderStack.indexOf('list') !== -1)) {
            ctx.html += '<span class="indent"></span>';
        }
        ctx.driver.renderElements(ctx, paragraphEl.inlineElements);
        ctx.html += '</p>';
    }

    renderListBlock(ctx: RenderContext<LaTeXRendererExt>, listBlockEl: ListBlock) {
        ctx.texCtx.renderStack.push('list');
        super.renderListBlock(ctx, listBlockEl);
        ctx.texCtx.renderStack.pop();
    }
}
