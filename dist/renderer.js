"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const token_1 = require("./token");

class Renderer {
    constructor(parser, renderOptions) {
        this.parser = parser;
        this.stack = renderOptions.originStack || [this.createLinkMap, this.handleElements];
    }

    // noinspection JSUnusedGlobalSymbols
    addMiddleware(middleware) {
        this.stack.push(middleware);
    }

    // noinspection JSUnusedGlobalSymbols
    render(s) {
        let stackIndex = 0;
        let ctx = {
            render: this, tokens: this.parser.parseBlockElements(s), linkDefs: {}, html: '', next() {
                for (; stackIndex < ctx.render.stack.length;) {
                    ctx.render.stack[stackIndex++](ctx);
                }
            }
        };
        ctx.next();
        return ctx.html;
    }

    renderElements(ctx, elements) {
        for (let el of elements) {
            ctx.render.handleElement(ctx, el);
        }
    }

    createLinkMap(ctx) {
        for (let el of ctx.tokens) {
            if (el.token_type === token_1.TokenType.LinkDefinition) {
                let linkDef = el;
                ctx.linkDefs[linkDef.linkIdentifier] = linkDef;
            }
        }
    }

    handleElements(ctx) {
        for (let el of ctx.tokens) {
            ctx.render.handleElement(ctx, el);
        }
    }

    handleElement(ctx, el) {
        switch (el.token_type) {
            case token_1.TokenType.Paragraph:
                this.renderParagraph(ctx, el);
                break;
            case token_1.TokenType.NewLine:
                this.renderNewLine(ctx, el);
                break;
            case token_1.TokenType.Quotes:
                this.renderQuotes(ctx, el);
                break;
            case token_1.TokenType.ListBlock:
                this.renderListBlock(ctx, el);
                break;
            case token_1.TokenType.Horizontal:
                this.renderHorizontal(ctx, el);
                break;
            case token_1.TokenType.LinkDefinition:
                this.renderLinkDefinition(ctx, el);
                break;
            case token_1.TokenType.CodeBlock:
                this.renderCodeBlock(ctx, el);
                break;
            case token_1.TokenType.HTMLBlock:
                this.renderHTMLBlock(ctx, el);
                break;
            case token_1.TokenType.HeaderBlock:
                this.renderHeaderBlock(ctx, el);
                break;
            case token_1.TokenType.InlinePlain:
                this.renderInlinePlain(ctx, el);
                break;
            case token_1.TokenType.Link:
                this.renderLink(ctx, el);
                break;
            case token_1.TokenType.ImageLink:
                this.renderImageLink(ctx, el);
                break;
            case token_1.TokenType.Emphasis:
                this.renderEmphasis(ctx, el);
                break;
            case token_1.TokenType.InlineCode:
                this.renderInlineCode(ctx, el);
                break;
            default:
                throw new Error(`invalid Token Type: ${el.token_type}`);
        }
    }

    renderParagraph(ctx, el) {
        ctx.html += '<p>';
        ctx.render.renderElements(ctx, el.inlineElements);
        ctx.html += '</p>';
    }

    renderNewLine(_, __) {
        // ignore it
    }

    renderQuotes(ctx, el) {
        ctx.html += '<blockquote>';
        ctx.render.renderElements(ctx, el.insideTokens);
        ctx.html += '</blockquote>';
    }

    renderListBlock(ctx, el) {
        let listBlock = el;
        ctx.html += '<' + (listBlock.ordered ? 'ol' : 'ul') + '>';
        for (let listEl of listBlock.listElements) {
            // omitting listEl.blankSeparated
            ctx.html += '<li>';
            ctx.render.renderElements(ctx, listEl.innerBlocks);
            ctx.html += '</li>';
        }
        ctx.html += '</' + (listBlock.ordered ? 'ol' : 'ul') + '>';
    }

    renderHorizontal(ctx, _) {
        ctx.html += "<hr/>";
    }

    renderLinkDefinition(_, __) {
        // ignore it
    }

    renderCodeBlock(ctx, el) {
        ctx.html += '<pre><code>' +
            (el).body +
            +'</pre></code>';
    }

    renderHTMLBlock(ctx, el) {
        ctx.html += (el).body;
    }

    renderHeaderBlock(ctx, el) {
        let headerBlock = el;
        ctx.html += "<h" + headerBlock.level + ">";
        ctx.render.renderElements(ctx, headerBlock.inlineElements);
        ctx.html += "</h" + headerBlock.level + ">";
    }

    renderInlinePlain(ctx, el) {
        ctx.html += (el).content;
    }

    renderLink(ctx, el) {
        let link = el;
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

    renderImageLink(ctx, el) {
        let link = el;
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

    renderEmphasis(ctx, el) {
        let emphasisEl = el;
        ctx.html += (emphasisEl.level === 2 ? '<strong>' : '<em>') + emphasisEl.content +
            (emphasisEl.level === 2 ? '</strong>' : '</em>');
    }

    renderInlineCode(ctx, el) {
        ctx.html += '<code>' + el.content + '</code>';
    }
}

exports.Renderer = Renderer;
