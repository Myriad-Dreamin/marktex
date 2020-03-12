export enum BraceType {
    // {}
    Brace,
    // []
    Bracket,
    // ()
    Parenthesis,

}

export interface TexCmdVar {
    // option = '(' '[' '{'
    braceType: string,
    text: string;
}


type commandFunc = (ctx: TexContext, vars: TexCmdVar[]) => string;


interface TexContext {
    // predefined commands
    texCommands: { [commandName: string]: commandFunc | undefined }
    // command defined in markdown documents
    texCommandDefs: { [commandName: string]: commandFunc | undefined }
}

// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
export const texCommands: { [commandName: string]: commandFunc } = {
    newcommand(ctx: TexContext, vars: TexCmdVar[]): string {
        // console.log(vars);
        return '';
    }
};


export class LaTeXParser {

    public static readonly cmdRegex = /^\\([a-zA-Z_]\w*)(?:\s|\[[^\]]*]|\([^)]*\)|{[^}]*})*/;
    public static readonly braceRegex = /{[^}]*}|\[[^\]]*]|\([^)]*\)/g;

    tex(ctx: TexContext, s: string): string {
        let markdownText: string = '', matched: string, lastMatched: number = 0;
        for (let i = 0; i < s.length;) {
            if ('\\' == s[i]) {
                let capturing = LaTeXParser.cmdRegex.exec(s.slice(i));
                if (capturing === null) {
                    continue;
                }
                matched = capturing[0];
                // console.log(matched, '|');
                i += matched.length;
                let cmdName = capturing[1];
                let q: commandFunc | undefined = ctx.texCommandDefs[cmdName] || ctx.texCommands[cmdName];
                if (q) {
                    markdownText += s.slice(lastMatched, i - matched.length);
                    // console.log(q);
                    let rawVars: string[] | null = matched.match(LaTeXParser.braceRegex);
                    let vars: TexCmdVar[] = [];
                    if (rawVars !== null) {

                    }

                    lastMatched = i;
                    while (lastMatched > matched.length && ' \t\v\f\r\n '.includes(matched[lastMatched - matched.length - 1])) {
                        lastMatched--;
                    }
                } else {
                    markdownText += s.slice(lastMatched, i);
                    lastMatched = i;
                }
            } else {
                i++
            }
        }
        if (lastMatched < s.length) {
            markdownText += s.substr(lastMatched);
        }
        return markdownText;
    }
}
