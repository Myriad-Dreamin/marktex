import {StringStream} from "./source";

export enum BraceType {
    // {}
    Brace = 0,
    // []
    Bracket = 1,
    // ()
    Parenthesis = 2,

}

export declare type BraceTypeKT = typeof BraceType;

export interface TexCmdVar {
    // option = '(' '[' '{'
    braceType: BraceType,
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


type commandFunc = (ctx: TexContext, vars: TexCmdVar[]) => string;


interface TexContext {
    // predefined commands
    texCommands: { [commandName: string]: commandFunc | undefined }
    // command defined in markdown documents
    texCommandDefs: { [commandName: string]: commandFunc | undefined }
}

function traceError(_: TexContext, err: Error) {
    console.error(err);
}

let replaceRegex: RegExp[] = [
    /(?<!\\)#1/g, /(?<!\\)#2/g, /(?<!\\)#3/g, /(?<!\\)#4/g,
    /(?<!\\)#5/g, /(?<!\\)#6/g, /(?<!\\)#7/g, /(?<!\\)#8/g, /(?<!\\)#9/g,
];

function traceInvalidCommand(cmdName: string, ctx: TexContext) {
    // bind is as fast as this
    return (args: any) =>
        traceError(ctx, new LaTeXInvalidCommandError(
            "the shape of " + cmdName + "'s args is invalid", args))
}

function expectBraceType(vars: TexCmdVar[], tracer: (args: any) => void) {
    // bind is as fast as this
    let e: { expect: (pos: number, t: BraceType) => void, failed?: boolean } = {
        expect(pos: number, t: BraceType) {
            if (vars[pos].braceType !== t) {
                tracer({
                    invalid_brace_type: BraceType[vars[pos].braceType],
                    want_brace_type: BraceType[t],
                    at_pos: pos,
                });
                e.failed = true;
            }
        }
    };

    return e
}

// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
export const texCommands: { [commandName: string]: commandFunc } = {
    newcommand(ctx: TexContext, vars: TexCmdVar[]): string {
        let tracer = traceInvalidCommand('newcommand', ctx);
        if (vars.length < 2) {
            tracer({
                invalid_length: vars.length,
            });
            return '';
        }
        let ebt = expectBraceType(vars, tracer);
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
                "the shape of newcommand's args is invalid", {
                    expected: "new command's name should begin with '\\'",
                }));
            return '';
        }

        cmdName = cmdName.slice(1);
        if (ctx.texCommandDefs.hasOwnProperty(cmdName) ||
            ctx.texCommands.hasOwnProperty(cmdName)) {
            traceError(ctx, new LaTeXInvalidCommandError(
                "conflict definition of newcommand", {
                    commandName: cmdName,
                }));
            return '';
        }

        let commandVarsCount = Number.parseInt(vars[1].text, 10);
        if (Number.NaN === commandVarsCount ||
            commandVarsCount >= 10 || commandVarsCount < 0) {
            traceError(ctx, new LaTeXInvalidCommandError(
                "invalid newcommand args count", {
                    commandName: vars[1],
                }));
            return '';
        }
        let optionVars = vars.slice(1, vars.length - 1), textTemplate = vars[vars.length - 1].text;
        ctx.texCommandDefs[cmdName] = function (ctx: TexContext, args: TexCmdVar[]): any {
            let tracer = traceInvalidCommand(cmdName, ctx);

            if (args.length + optionVars.length < commandVarsCount || args.length > commandVarsCount) {
                tracer({
                    invalid_length: vars.length,
                });
                return '';
            }
            let ebt = expectBraceType(args, tracer);
            for (let i = 0; i < args.length; i++) {
                ebt.expect(i, BraceType.Brace);
            }
            if (ebt.failed) {
                return '';
            }


            let coveredL = commandVarsCount - args.length;
            let res: string = textTemplate;
            for (let i = 0; i < coveredL; i++) {
                res = res.replace(replaceRegex[i], optionVars[i].text);
            }
            for (let i = 0; i < args.length; i++) {
                res = res.replace(replaceRegex[i + coveredL], args[i].text);
            }
            return res;
        };


        return '';
    }
};

function _braceMatch(res: TexCmdVar[], s: StringStream,
                     l: string, r: string, t: BraceType) {
    if (s.source[0] == l) {
        let c: number = 0;
        for (let j = 0; j < s.source.length; j++) {
            if (s.source[j] == l) {
                c++;
            } else if (s.source[j] == r) {
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

function braceMatch(s: StringStream) {
    let res: TexCmdVar[] = [];
    for (let i = 0; !s.eof; i = 0) {
        for (; !s.eof && ' \n\t\v\f\r'.includes(s.source[i]); i++) {
        }
        if (!'([{'.includes(s.source[i])) {
            return res;
        }
        if (i) s.forward(i);

        _braceMatch(res, s, '(', ')', BraceType.Parenthesis);
        _braceMatch(res, s, '[', ']', BraceType.Bracket);
        _braceMatch(res, s, '{', '}', BraceType.Brace);
    }
    return res;
}


export class LaTeXParser {

    public static readonly cmdNameRegex = /\\([a-zA-Z_]\w*)/;

    tex(ctx: TexContext, s: StringStream): string {
        let markdownText: string = '', matched: string;
        while (!s.eof) {
            let capturing = LaTeXParser.cmdNameRegex.exec(s.source);
            if (capturing === null) {
                return markdownText + s.source;
            }
            matched = capturing[0];
            let cmdName = capturing[1];
            let cmd: commandFunc | undefined = ctx.texCommandDefs[cmdName] || ctx.texCommands[cmdName];
            if (cmd) {
                markdownText += s.source.slice(0, capturing.index);
                s.forward(capturing.index + capturing[0].length);
                let vars: TexCmdVar[] = braceMatch(s);

                markdownText += cmd(ctx, vars);
            } else {
                markdownText += s.source.slice(0, capturing.index + capturing[0].length);
                s.forward(capturing.index + capturing[0].length);
            }
        }
        return markdownText;
    }
}
