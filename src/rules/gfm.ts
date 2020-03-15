import {Rule, RuleContext} from "./rule";
import {forwardRegexp, StringStream} from "../lib/stream";
import {CodeBlock, MaybeToken} from "../token/token";

export class GFMFencedCodeBlockRule implements Rule {
    readonly name: string = "GFMCodeBlock";
    readonly description: string = "GFM Markdown Block Rule";

    public static readonly backtickRegex: RegExp = /^(`{3,}) *([^`\s]+)?[^`\n]*(?:\n|$)([\s\S]*?)(?:\1`*|$)/;
    public static readonly tildeRegex: RegExp = /^(~{3,}) *([^~\s]+)?.*(?:\n|$)([\s\S]*?)(?:\1~*|$)/;

    match(s: StringStream, _: RuleContext): MaybeToken {
        let capturing = GFMFencedCodeBlockRule.backtickRegex.exec(s.source);
        if (capturing === null) {
            capturing = GFMFencedCodeBlockRule.tildeRegex.exec(s.source);
            if (capturing === null) {
                return undefined;
            }
        }

        forwardRegexp(s, capturing);
        return new CodeBlock(capturing[3], capturing[2]);
    };
}