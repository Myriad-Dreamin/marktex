import {StringStream} from '../';
import {escapeHTML} from '../lib/escape';

export enum BraceType {
  // {}
  Brace = 0,
  // []
  Bracket = 1,
  // ()
  // Parenthesis = 2,

}

export declare type BraceTypeKT = typeof BraceType;

export interface TexCmdVar {
  // option = '(' '[' '{'
  braceType: BraceType;
  text: string;
}

export class LaTeXError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LaTexError';
  }
}

export class LaTeXInvalidCommandError extends LaTeXError {
  public readonly args: any;

  constructor(message: string, args: any) {
    super(message);
    this.name = 'LaTeXInvalidCommandError';
    this.args = args;
  }
}


export type commandFunc = (
  ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string) => string;

export type TexContext<TexExtends = any> = {
  // predefined commands
  readonly texCommands: { [commandName: string]: commandFunc | undefined }
  // command defined in markdown documents
  texCommandDefs: { [commandName: string]: commandFunc | undefined }
  underMathEnv?: boolean
} & TexExtends;

export function traceError(_: TexContext, err: Error): void {
  console.error(err);
}

export function traceInvalidCommand(cmdName: string, ctx: TexContext): (args: any) => void {
  // bind is as fast as this
  return (args: any) =>
    traceError(ctx, new LaTeXInvalidCommandError(
      'the shape of ' + cmdName + '\'s args is invalid', args));
}

export function expectBraceType(vars: TexCmdVar[], tracer: (args: any) => void) {
  // bind is as fast as this
  const e: { expect: (pos: number, t: BraceType) => void, failed?: boolean } = {
    expect(pos: number, t: BraceType): void {
      if (vars[pos].braceType !== t) {
        tracer({
          invalid_brace_type: BraceType[vars[pos].braceType],
          want_brace_type: BraceType[t],
          at_pos: pos,
        });
        e.failed = true;
      }
    },
  };

  return e;
}

export function expectTheOnlyBrace(vars: TexCmdVar[], tracer: (args: any) => void): boolean {

  if (vars.length < 1) {
    tracer({
      invalid_length: vars.length,
    });
    return false;
  }
  const ebt = expectBraceType(vars, tracer);
  ebt.expect(0, BraceType.Brace);
  return !ebt.failed;
}


function releaseVars(vars: TexCmdVar[], n: number) {
  let res = '';
  for (let i = n; i < vars.length; i++) {
    switch (vars[i].braceType) {
      case BraceType.Brace:
        res += '{' + vars[i].text + '}';
        break;
      case BraceType.Bracket:
        res += '[' + vars[i].text + ']';
        break;
      // case BraceType.Parenthesis:
      //     res += '(' + vars[i].text + ')';
      //     break
      default:
        throw new LaTeXError(`not known brace type: ${vars[i].braceType}`);
    }
  }
  return res;
}

const replaceRegex: RegExp[] = [
  /#1/g, /#2/g, /#3/g, /#4/g, /#5/g, /#6/g, /#7/g, /#8/g, /#9/g,
];

// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
export const texCommands: { [commandName: string]: commandFunc } = {
  newcommand(ctx: TexContext, vars: TexCmdVar[]): string {
    const tracer = traceInvalidCommand('newcommand', ctx);
    if (vars.length < 2) {
      tracer({
        invalid_length: vars.length,
      });
      return '';
    }
    const ebt = expectBraceType(vars, tracer);
    ebt.expect(0, BraceType.Brace);
    ebt.expect(vars.length - 1, BraceType.Brace);
    for (let i = vars.length - 2; i > 0; i--) {
      ebt.expect(i, BraceType.Bracket);
    }
    if (ebt.failed) {
      return '';
    }
    let cmdName: string = vars[0].text;
    if (cmdName[0] !== '\\') {
      traceError(ctx, new LaTeXInvalidCommandError(
        'the shape of newcommand\'s args is invalid', {
          expected: 'new command\'s name should begin with \'\\\'',
        }));
      return '';
    }

    cmdName = cmdName.slice(1);
    if (ctx.texCommandDefs.hasOwnProperty(cmdName) ||
      ctx.texCommands.hasOwnProperty(cmdName)) {
      traceError(ctx, new LaTeXInvalidCommandError(
        'conflict definition of newcommand', {
          commandName: cmdName,
        }));
      return '';
    }

    const commandVarsCount = Number.parseInt(vars[1].text, 10);
    if (Number.NaN === commandVarsCount ||
      commandVarsCount >= 10 || commandVarsCount < 0) {
      traceError(ctx, new LaTeXInvalidCommandError(
        'invalid newcommand args count', {
          commandName: vars[1],
        }));
      return '';
    }
    const optionVars = vars.slice(1, vars.length - 1), textTemplate = vars[vars.length - 1].text;
    // tslint:disable-next-line:only-arrow-functions
    ctx.texCommandDefs[cmdName] = function(
      subCtx: TexContext, args: TexCmdVar[], tex: (subCtx: TexContext, s: StringStream) => string): any {
      const tracer = traceInvalidCommand(cmdName, subCtx);

      if (args.length + optionVars.length < commandVarsCount) {
        tracer({
          invalid_length: vars.length,
        });
        return '';
      }
      const ebt = expectBraceType(args, tracer);
      for (let i = 0; i < args.length; i++) {
        ebt.expect(i, BraceType.Brace);
      }
      if (ebt.failed) {
        return '';
      }


      const coveredL = Math.max(commandVarsCount - args.length, 0);
      const coveredR = Math.min(commandVarsCount, args.length);
      let res: string = textTemplate;
      for (let i = 0; i < coveredL; i++) {
        res = res.replace(replaceRegex[i], optionVars[i].text);
      }
      for (let i = 0; i < coveredR; i++) {
        res = res.replace(replaceRegex[i + coveredL], args[i].text);
      }
      return tex(subCtx, new StringStream(res + releaseVars(args, coveredR)));
    };

    return '';
  },
  par(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '\\par';
    }

    return '<br/>' + tex(ctx, new StringStream(releaseVars(vars, 0)));
  },
  R(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '\\mathbb{R}' + releaseVars(vars, 0);
    }

    return '\\R' + tex(ctx, new StringStream(releaseVars(vars, 0)));
  },
  indent(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '\\indent';
    }
    return /*'<br/>' + */ tex(ctx, new StringStream(releaseVars(vars, 0)));
  },
  url(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '';
    }
    if (!expectTheOnlyBrace(vars, traceInvalidCommand('url', ctx))) {
      return '';
    }
    const t = escapeHTML(vars[0].text);
    return '<a href="' + t + '">' + t + '</a>' +
      tex(ctx, new StringStream(releaseVars(vars, 1)));
  },
  section(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '';
    }
    if (!expectTheOnlyBrace(vars, traceInvalidCommand('section', ctx))) {
      return '';
    }
    return '<h1>' + tex(ctx, new StringStream(vars[0].text)) + '</h1>' +
      tex(ctx, new StringStream(releaseVars(vars, 1)));
  },
  subsection(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '';
    }
    if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsecion', ctx))) {
      return '';
    }
    return '<h3>' + tex(ctx, new StringStream(vars[0].text)) + '</h3>' +
      tex(ctx, new StringStream(releaseVars(vars, 1)));
  },
  subsubsection(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '';
    }
    if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsubsection', ctx))) {
      return '';
    }
    return '<h5>' + tex(ctx, new StringStream(vars[0].text)) + '</h5>' +
      tex(ctx, new StringStream(releaseVars(vars, 1)));
  },
  subsubsubsection(ctx: TexContext, vars: TexCmdVar[], tex: (ctx: TexContext, s: StringStream) => string): string {
    if (ctx.underMathEnv) {
      return '';
    }
    if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsubsubsection', ctx))) {
      return '';
    }
    return '<h6>' + tex(ctx, new StringStream(vars[0].text)) + '</h6>' +
      tex(ctx, new StringStream(releaseVars(vars, 1)));
  },
};

function _braceMatch(res: TexCmdVar[], s: StringStream,
                     l: string, r: string, t: BraceType): void {
  if (s.source[0] === l) {
    let c = 0;
    for (let j = 0; j < s.source.length; j++) {
      if (s.source[j] === l) {
        c++;
      } else if (s.source[j] === r) {
        c--;
        if (c === 0) {
          res.push({braceType: t, text: s.source.slice(1, j)});
          s.forward(j + 1);
          return;
        }
      }
    }
    s.forward(s.source.length);
  }
  return;
}

function braceMatch(s: StringStream): TexCmdVar[] {
  const res: TexCmdVar[] = [];
  for (let i = 0; !s.eof; i = 0) {
    for (; !s.eof && ' \n\t\v\f\r'.includes(s.source[i]); i++) {
    }
    if (!'[{'.includes(s.source[i])) {
      return res;
    }
    if (i) {
      s.forward(i);
    }

    // _braceMatch(res, s, '(', ')', BraceType.Parenthesis);
    _braceMatch(res, s, '[', ']', BraceType.Bracket);
    _braceMatch(res, s, '{', '}', BraceType.Brace);
  }
  return res;
}

export class LaTeXParser {

  public static readonly cmdNameRegex = /\\([a-zA-Z]+)/;

  tex(ctx: TexContext, s: StringStream): string {
    if (ctx.underMathEnv) {
      return this.texMath(ctx, s);
    }
    let markdownText = '';
    let matched: string;
    while (!s.eof) {
      const capturing = LaTeXParser.cmdNameRegex.exec(s.source);
      if (capturing === null) {
        return markdownText + escapeHTML(s.source);
      }
      matched = capturing[0];
      const cmdName = capturing[1];
      const cmd: commandFunc | undefined = ctx.texCommandDefs[cmdName] || ctx.texCommands[cmdName];
      if (cmd) {
        markdownText += escapeHTML(s.source.slice(0, capturing.index));
        s.forward(capturing.index + capturing[0].length);
        const vars: TexCmdVar[] = braceMatch(s);

        markdownText += cmd(ctx, vars, this.tex.bind(this));
      } else {
        markdownText += escapeHTML(s.source.slice(0, capturing.index + capturing[0].length));
        s.forward(capturing.index + capturing[0].length);
      }
    }
    return markdownText;
  }

  texMath(ctx: TexContext, s: StringStream): string {
    let markdownText = '';
    let matched: string;
    while (!s.eof) {
      const capturing = LaTeXParser.cmdNameRegex.exec(s.source);
      if (capturing === null) {
        return markdownText + s.source;
      }
      matched = capturing[0];
      const cmdName = capturing[1];
      const cmd: commandFunc | undefined = ctx.texCommandDefs[cmdName] || ctx.texCommands[cmdName];
      if (cmd) {
        markdownText += s.source.slice(0, capturing.index);
        s.forward(capturing.index + capturing[0].length);
        const vars: TexCmdVar[] = braceMatch(s);

        markdownText += cmd(ctx, vars, this.texMath);
      } else {
        markdownText += s.source.slice(0, capturing.index + capturing[0].length);
        s.forward(capturing.index + capturing[0].length);
      }
    }
    return markdownText;
  }
}
