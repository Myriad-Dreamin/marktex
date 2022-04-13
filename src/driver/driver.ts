import {Parser} from '../parser/parser';
import {StringStream} from '../lib/stream';
import {commandFunc, LaTeXParser, texCommands} from '../parser/tex-parser';
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
  TokenType,
} from '../token/token';
import {IRenderDriver, IRenderDriverInner, IRenderer, RenderContext} from '../proto';

export type RenderMiddleware = (ctx: RenderContext) => void;

export interface RenderDriverOptions {
  originStack?: RenderMiddleware[];
}

class RenderDriverInner implements IRenderDriverInner {
  renderElements(ctx: RenderContext, elements: Token[]): void {
    for (const el of elements) {
      ctx.driver.renderElement(ctx, el);
    }
  }

  renderElement(ctx: RenderContext, el: Token): void {
    switch (el.token_type) {
      case TokenType.Paragraph:
        ctx.render.renderParagraph(ctx, el as Paragraph);
        break;
      case TokenType.NewLine:
        ctx.render.renderNewLine(ctx, el as NewLine);
        break;
      case TokenType.Quotes:
        ctx.render.renderQuotes(ctx, el as Quotes);
        break;
      case TokenType.ListBlock:
        ctx.render.renderListBlock(ctx, el as ListBlock);
        break;
      case TokenType.Horizontal:
        ctx.render.renderHorizontal(ctx, el as Horizontal);
        break;
      case TokenType.LinkDefinition:
        ctx.render.renderLinkDefinition(ctx, el as LinkDefinition);
        break;
      case TokenType.CodeBlock:
        ctx.render.renderCodeBlock(ctx, el as CodeBlock);
        break;
      // can latex
      case TokenType.HTMLBlock:
        ctx.render.renderHTMLBlock(ctx, el as HTMLBlock);
        break;
      case TokenType.HeaderBlock:
        ctx.render.renderHeaderBlock(ctx, el as HeaderBlock);
        break;
      // can latex
      case TokenType.InlinePlain:
        ctx.render.renderInlinePlain(ctx, el as InlinePlain);
        break;
      // can latex
      case TokenType.Link:
        ctx.render.renderLink(ctx, el as Link);
        break;
      case TokenType.ImageLink:
        ctx.render.renderImageLink(ctx, el as ImageLink);
        break;
      case TokenType.MathBlock:
        ctx.render.renderMathBlock(ctx, el as MathBlock);
        break;
      case TokenType.LatexBlock:
        ctx.render.renderLatexBlock(ctx, el as LaTeXBlock);
        break;
      // can latex
      case TokenType.Emphasis:
        ctx.render.renderEmphasis(ctx, el as Emphasis);
        break;
      case TokenType.InlineCode:
        ctx.render.renderInlineCode(ctx, el as InlineCode);
        break;
      default:
        throw new Error(`invalid Token Type: ${el.token_type}`);
    }
  }
}

export class RenderDriver implements IRenderDriver {
  protected inner: RenderDriverInner;
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
    this.inner = new RenderDriverInner();
    this.latexParser = new LaTeXParser();
    this.texCommands = texCommands;
    this.stack = opts?.originStack || [
      RenderDriver.createLinkMap, RenderDriver.handleElements, RenderDriver.mergeOneLineParagraph];
  }

  static createLinkMap(ctx: RenderContext): void {
    for (const el of ctx.tokens) {
      if (el.token_type === TokenType.LinkDefinition) {
        const linkDef: LinkDefinition = el as LinkDefinition;
        ctx.linkDefs[linkDef.linkIdentifier] = linkDef;
      }
    }
  }

  static handleElements(ctx: RenderContext): void {
    ctx.driver.renderElements(ctx, ctx.tokens);
  }

  static mergeOneLineParagraph(ctx: RenderContext): void {

  }

  // noinspection JSUnusedGlobalSymbols
  addMiddleware(middleware: RenderMiddleware): void {
    this.stack.push(middleware);
  }

  getRenderer(): IRenderer {
    return this.renderer;
  }

  setRenderer(r: IRenderer): void {
    this.renderer = r;
  }

  createContext(mdFieldTexCommands?: { [cn: string]: commandFunc }): RenderContext {
    const ctx = {
      linkDefs: {},
      html: '',
      driver: this.inner,
      render: this.renderer,
      parser: this.parser,
      latexParser: this.latexParser,
      tokens: [],

      texCtx: {
        texCommands: this.texCommands,
        texCommandDefs: mdFieldTexCommands || {},
      },
      _next(): void {
      },
      next(): void {
        this._next();
      },
    };
    if (this.renderer.initContext) {
      this.renderer.initContext(ctx);
    }

    return ctx;
  }

  renderElements(ctx: RenderContext, tokens: Token[]): string {
    let stackIndex = 0;
    const stack = this.stack;
    ctx.tokens = tokens;
    (ctx as any)._next = function _next(): void {
      for (; stackIndex < stack.length;) {
        stack[stackIndex++](ctx);
      }
    };
    ctx.html = '';
    ctx.next();
    return ctx.html;
  }

  parseBlockElements(s: StringStream): Token[] {
    return this.parser.parseBlockElements(s);
  }

  parseBlockElementsString(s: string): Token[] {
    return this.parser.parseBlockElements(new StringStream(s));
  }

  render(s: StringStream, mdFieldTexCommands?: { [cn: string]: commandFunc }): string {
    return this.renderElements(this.createContext(mdFieldTexCommands), this.parseBlockElements(s));
  }

  renderString(s: string, mdFieldTexCommands?: { [cn: string]: commandFunc }): string {
    return this.render(new StringStream(s), mdFieldTexCommands);
  }
}
