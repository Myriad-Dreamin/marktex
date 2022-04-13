import {Parser} from './parser/parser';
import {HighlightFunc, LaTeXRenderer, Renderer, RenderMathFunc} from './renderer/renderer';
import {StringStream} from './lib/stream';
import {newBlockRules, newInlineRules, newRules} from './rules';
import {HTMLBlockOptions} from './rules/std';
import {RenderDriver, RenderMiddleware} from './driver/driver';

interface MarkTeXBasicEnableOptions {
  enableLaTeX?: boolean;
  enableGFMRules?: boolean;
  enableHtml?: boolean;
}

export interface MarkTeXParserOptions extends MarkTeXBasicEnableOptions {
  HTMLBlockOptions?: HTMLBlockOptions;
}

export interface MarkTeXRendererOptions extends MarkTeXBasicEnableOptions {
  renderStyle?: 'default' | 'gfm' | 'latex';
  highlight?: HighlightFunc;
  renderMath?: RenderMathFunc;
  wrapCodeClassTag?: (language: string) => string;

  originStack?: RenderMiddleware[];
}

export interface MarkTeXRenderDriverOptions extends MarkTeXParserOptions, MarkTeXRendererOptions {
  parser?: Parser;
  renderer?: Renderer;
}

//
// originStack?: RenderMiddleware[],
//     wrapCodeClassTag?: (language: string) => string,
//     highlight?: HighlightFunc,
//     enableLaTeX?: boolean,

// noinspection JSUnusedGlobalSymbols
const myriad = {
  author: 'Myriad-Dreamin',
  newParser(options?: MarkTeXParserOptions): Parser {
    return new Parser(newRules(options));
  },
  newRenderer(options?: MarkTeXRendererOptions): Renderer {
    return options?.renderStyle === 'latex' ? new LaTeXRenderer(options) : new Renderer(options);
  },
  newRenderDriver(options?: MarkTeXRenderDriverOptions): RenderDriver {
    return new RenderDriver(
      options?.parser || myriad.newParser(options),
      options?.renderer || myriad.newRenderer(options),
      options);
  },
  newStringStream(str: string): StringStream {
    return new StringStream(str);
  },
  newInlineRules, newBlockRules, newRules,
  Parser, Renderer, RenderDriver, StringStream,
};


// noinspection JSUnusedGlobalSymbols
export default myriad;
export {myriad, Parser, Renderer, RenderDriver, StringStream};
