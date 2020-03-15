"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
var BraceType;
(function (BraceType) {
    // {}
    BraceType[BraceType["Brace"] = 0] = "Brace";
    // []
    BraceType[BraceType["Bracket"] = 1] = "Bracket";
    // ()
    // Parenthesis = 2,
})(BraceType = exports.BraceType || (exports.BraceType = {}));
class LaTeXError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LaTexError';
    }
}
exports.LaTeXError = LaTeXError;
class LaTeXInvalidCommandError extends LaTeXError {
    constructor(message, args) {
        super(message);
        this.name = 'LaTeXInvalidCommandError';
        this.args = args;
    }
}
exports.LaTeXInvalidCommandError = LaTeXInvalidCommandError;
function traceError(_, err) {
    console.error(err);
}
exports.traceError = traceError;
function traceInvalidCommand(cmdName, ctx) {
    // bind is as fast as this
    return (args) => traceError(ctx, new LaTeXInvalidCommandError("the shape of " + cmdName + "'s args is invalid", args));
}
exports.traceInvalidCommand = traceInvalidCommand;
function expectBraceType(vars, tracer) {
    // bind is as fast as this
    let e = {
        expect(pos, t) {
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
    return e;
}
exports.expectBraceType = expectBraceType;
function expectTheOnlyBrace(vars, tracer) {
    if (vars.length < 1) {
        tracer({
            invalid_length: vars.length,
        });
        return false;
    }
    let ebt = expectBraceType(vars, tracer);
    ebt.expect(0, BraceType.Brace);
    return !ebt.failed;
}
exports.expectTheOnlyBrace = expectTheOnlyBrace;
function releaseVars(vars, n) {
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
let replaceRegex = [
    /(?<!\\)#1/g, /(?<!\\)#2/g, /(?<!\\)#3/g, /(?<!\\)#4/g,
    /(?<!\\)#5/g, /(?<!\\)#6/g, /(?<!\\)#7/g, /(?<!\\)#8/g, /(?<!\\)#9/g,
];
// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
exports.texCommands = {
    newcommand(ctx, vars) {
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
        let cmdName = vars[0].text;
        if (cmdName[0] !== '\\') {
            traceError(ctx, new LaTeXInvalidCommandError("the shape of newcommand's args is invalid", {
                expected: "new command's name should begin with '\\'",
            }));
            return '';
        }
        cmdName = cmdName.slice(1);
        if (ctx.texCommandDefs.hasOwnProperty(cmdName) ||
            ctx.texCommands.hasOwnProperty(cmdName)) {
            traceError(ctx, new LaTeXInvalidCommandError("conflict definition of newcommand", {
                commandName: cmdName,
            }));
            return '';
        }
        let commandVarsCount = Number.parseInt(vars[1].text, 10);
        if (Number.NaN === commandVarsCount ||
            commandVarsCount >= 10 || commandVarsCount < 0) {
            traceError(ctx, new LaTeXInvalidCommandError("invalid newcommand args count", {
                commandName: vars[1],
            }));
            return '';
        }
        let optionVars = vars.slice(1, vars.length - 1), textTemplate = vars[vars.length - 1].text;
        ctx.texCommandDefs[cmdName] = function (ctx, args, tex) {
            let tracer = traceInvalidCommand(cmdName, ctx);
            if (args.length + optionVars.length < commandVarsCount) {
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
            let coveredL = Math.max(commandVarsCount - args.length, 0);
            let coveredR = Math.min(commandVarsCount, args.length);
            let res = textTemplate;
            for (let i = 0; i < coveredL; i++) {
                res = res.replace(replaceRegex[i], optionVars[i].text);
            }
            for (let i = 0; i < coveredR; i++) {
                res = res.replace(replaceRegex[i + coveredL], args[i].text);
            }
            return tex(ctx, new __1.StringStream(res + releaseVars(args, coveredR)));
        };
        return '';
    },
    par(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '\\par';
        }
        return '<br/>' + tex(ctx, new __1.StringStream(releaseVars(vars, 0)));
    },
    indent(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '\\indent';
        }
        return /*'<br/>' + */ tex(ctx, new __1.StringStream(releaseVars(vars, 0)));
    },
    url(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '';
        }
        if (!expectTheOnlyBrace(vars, traceInvalidCommand('url', ctx))) {
            return '';
        }
        return '<a href="' + vars[0].text + '">' + vars[0].text + '</a>' +
            tex(ctx, new __1.StringStream(releaseVars(vars, 1)));
    },
    section(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '';
        }
        if (!expectTheOnlyBrace(vars, traceInvalidCommand('section', ctx))) {
            return '';
        }
        return '<h1>' + tex(ctx, new __1.StringStream(vars[0].text)) + '</h1>' +
            tex(ctx, new __1.StringStream(releaseVars(vars, 1)));
    },
    subsection(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '';
        }
        if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsecion', ctx))) {
            return '';
        }
        return '<h3>' + tex(ctx, new __1.StringStream(vars[0].text)) + '</h3>' +
            tex(ctx, new __1.StringStream(releaseVars(vars, 1)));
    },
    subsubsection(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '';
        }
        if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsubsection', ctx))) {
            return '';
        }
        return '<h5>' + tex(ctx, new __1.StringStream(vars[0].text)) + '</h5>' +
            tex(ctx, new __1.StringStream(releaseVars(vars, 1)));
    },
    subsubsubsection(ctx, vars, tex) {
        if (ctx.underMathEnv) {
            return '';
        }
        if (!expectTheOnlyBrace(vars, traceInvalidCommand('subsubsubsection', ctx))) {
            return '';
        }
        return '<h6>' + tex(ctx, new __1.StringStream(vars[0].text)) + '</h6>' +
            tex(ctx, new __1.StringStream(releaseVars(vars, 1)));
    }
};
function _braceMatch(res, s, l, r, t) {
    if (s.source[0] == l) {
        let c = 0;
        for (let j = 0; j < s.source.length; j++) {
            if (s.source[j] == l) {
                c++;
            }
            else if (s.source[j] == r) {
                c--;
                if (c === 0) {
                    res.push({ braceType: t, text: s.source.slice(1, j) });
                    s.forward(j + 1);
                    return;
                }
            }
        }
        s.forward(s.source.length);
    }
    return;
}
function braceMatch(s) {
    let res = [];
    for (let i = 0; !s.eof; i = 0) {
        for (; !s.eof && ' \n\t\v\f\r'.includes(s.source[i]); i++) {
        }
        if (!'[{'.includes(s.source[i])) {
            return res;
        }
        if (i)
            s.forward(i);
        // _braceMatch(res, s, '(', ')', BraceType.Parenthesis);
        _braceMatch(res, s, '[', ']', BraceType.Bracket);
        _braceMatch(res, s, '{', '}', BraceType.Brace);
    }
    return res;
}
class LaTeXParser {
    tex(ctx, s) {
        let markdownText = '', matched;
        while (!s.eof) {
            let capturing = LaTeXParser.cmdNameRegex.exec(s.source);
            if (capturing === null) {
                return markdownText + s.source;
            }
            matched = capturing[0];
            let cmdName = capturing[1];
            let cmd = ctx.texCommandDefs[cmdName] || ctx.texCommands[cmdName];
            if (cmd) {
                markdownText += s.source.slice(0, capturing.index);
                s.forward(capturing.index + capturing[0].length);
                let vars = braceMatch(s);
                markdownText += cmd(ctx, vars, this.tex);
            }
            else {
                markdownText += s.source.slice(0, capturing.index + capturing[0].length);
                s.forward(capturing.index + capturing[0].length);
            }
        }
        return markdownText;
    }
}
exports.LaTeXParser = LaTeXParser;
LaTeXParser.cmdNameRegex = /\\([a-zA-Z_]\w*)/;
