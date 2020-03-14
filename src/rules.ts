import {Rule, RuleContext} from "./rules/rule";
import {ParagraphRule} from './rules/paragraph';
import {
    CodeBlockRule,
    EmphasisRule,
    HeaderBlockRule,
    HorizontalRule,
    HTMLBlockRule,
    HTMLTagsRegexps,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    LinkDefinitionRule,
    LinkOrImageRule,
    ListBlockRule,
    NewLineRule,
    OpenTagRegExp,
    QuotesRule,
    RegExpWithTagName
} from "./rules/std";
import {InlineLatexCommandRule, InlineMathRule, LatexBlockRule, MathBlockRule} from "./rules/latex";
import {GFMFencedCodeBlockRule} from "./rules/gfm";

export {RuleContext, Rule};
export {HTMLTagsRegexps};


export const validTags: HTMLTagsRegexps = function (): HTMLTagsRegexps {
    let validTags: string = /^<open_tag>|<close_tag>|<comment>|<processing_instruction>|<declaration>|<cdata>/.source;
    let open_tag: string = /(?:<(<tag_name>)(?:\s*<attribute>)*\s*(\/?)>)/.source;
    let close_tag: string = /(?:<\/(<tag_name>)\s*>)/.source;
    let comment: RegExp = /(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)/;
    let processing_instruction: RegExp = /(?:<?(?:(?!\?>).)*\?>)/;
    let declaration: RegExp = /(?:<![A-Z]+[^>]*>)/;
    let cdata: RegExp = /(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/;

    let tag_name: RegExp = /(?:[a-zA-Z][a-zA-Z0-9-]*)/;
    let attribute: string = /(?:<attribute_name>(?:\s*=\s*<attribute_value>)?)/.source;
    let attribute_name: RegExp = /(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)/;
    let attribute_value: RegExp = /(?:[^/s'"=<>`]|'[^']*'|"[^"]*")/;

    attribute = attribute
        .replace('<attribute_name>', attribute_name.source)
        .replace('<attribute_value>', attribute_value.source);
    close_tag = close_tag.replace('<tag_name>', tag_name.source);
    open_tag = open_tag
        .replace('<tag_name>', tag_name.source)
        .replace('<attribute>', attribute);
    validTags = validTags
        .replace('<open_tag>', open_tag)
        .replace('<close_tag>', close_tag)
        .replace('<comment>', comment.source)
        .replace('<processing_instruction>', processing_instruction.source)
        .replace('<declaration>', declaration.source)
        .replace('<cdata>', cdata.source);

    return {
        validTags: new RegExp(validTags),
        open_tag: new OpenTagRegExp(new RegExp(open_tag), 1, 2),
        close_tag: new RegExpWithTagName(new RegExp(close_tag), 1),
        comment,
        others: [processing_instruction, declaration, cdata],
        // processing_instruction,
        // declaration,
        // cdata,
        // tag_name,
        // attribute: new RegExp(attribute),
        // attribute_name,
        // attribute_value,
    };
}();


export const inlineRules: Rule[] = newInlineRules();
export const blockRules: Rule[] = newBlockRules();

export interface CreateBlockRuleOptions {
    enableHtml?: boolean;
    enableLaTeX?: boolean;
    enableGFMRules?: boolean;
    validTags?: HTMLTagsRegexps;
}

export interface CreateInlineRuleOptions {
    enableLaTeX?: boolean;
}

export interface CreateRuleOptions extends CreateInlineRuleOptions, CreateBlockRuleOptions {

}

// noinspection JSUnusedGlobalSymbols
export function newBlockRules(
    opts?: CreateBlockRuleOptions): Rule[] {
    let rules0: Rule[] = [
        new NewLineRule(),
        new CodeBlockRule(),
        new LinkDefinitionRule(),
        new MathBlockRule(),
        new LatexBlockRule(),
    ];

    let rules1: Rule[] = [
        new QuotesRule(),
        new HeaderBlockRule(),
        new HorizontalRule(),
        new ListBlockRule(),
    ];

    let rules2: Rule[] = [
        new ParagraphRule({skipLaTeXBlock: opts?.enableLaTeX || false, skipMathBlock: true}),
    ];

    // default enable
    if (opts?.enableGFMRules !== false) {
        rules0.push(new GFMFencedCodeBlockRule());
    }

    if (opts?.enableHtml) {
        rules0.push(new HTMLBlockRule(opts?.validTags || validTags));
    }

    return [...rules0, ...rules1, ...rules2];
}

// noinspection JSUnusedGlobalSymbols
export function newInlineRules(
    opts?: CreateInlineRuleOptions): Rule[] {
    let rules0: Rule[] = [
        new InlinePlainExceptSpecialMarksRule(),
        new LinkOrImageRule(),
        new InlineMathRule(),
    ];

    let rules1: Rule[] = [
        new EmphasisRule(),
        new InlineCodeRule(),
        new InlinePlainRule(),
    ];

    // default not enable
    if (opts?.enableLaTeX !== false) {
        rules0.push(new InlineLatexCommandRule());
    }

    return [...rules0, ...rules1];
}

export function newRules(opts?: CreateRuleOptions) {
    return {
        inlineRules: newInlineRules(opts),
        blockRules: newBlockRules(opts),
    }
}
