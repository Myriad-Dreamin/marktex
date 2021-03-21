import {Rule, RuleContext} from "./rules/rule";
import {
    CodeBlockRule,
    EmphasisRule,
    HeaderBlockRule,
    HorizontalRule,
    HTMLBlockOptions,
    HTMLBlockRule,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    LinkDefinitionRule,
    LinkOrImageRule,
    ListBlockRule,
    NewLineRule,
    QuotesRule
} from "./rules/std";
import {InlineLatexCommandRule, InlineMathRule, LatexBlockRule, MathBlockRule, ParagraphRule} from "./rules/latex";
import {GFMFencedCodeBlockRule, GFMStrikeThroughRule, GFMTableBlockRule} from './rules/gfm';

export {RuleContext, Rule};

export const inlineRules: Rule[] = newInlineRules();
export const blockRules: Rule[] = newBlockRules();

export interface CreateBlockRuleOptions {
    enableHtml?: boolean;
    enableLaTeX?: boolean;
    enableGFMRules?: boolean;
    HTMLBlockOptions?: HTMLBlockOptions;
}

export interface CreateInlineRuleOptions {
    enableLaTeX?: boolean;
    enableGFMRules?: boolean;
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
        new ListBlockRule({enableGFMRules: opts?.enableGFMRules}),
    ];

    let rules2: Rule[] = [
        new ParagraphRule(),
    ];

    // default enable
    if (opts?.enableGFMRules !== false) {
        rules0.push(new GFMTableBlockRule(), new GFMFencedCodeBlockRule());
    }

    if (opts?.enableHtml) {
        rules0.push(new HTMLBlockRule(opts?.HTMLBlockOptions));
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

    if (opts?.enableGFMRules !== false) {
        rules0.push(new GFMStrikeThroughRule());
    }

    return [...rules0, ...rules1];
}

export function newRules(opts?: CreateRuleOptions) {
    return {
        inlineRules: newInlineRules(opts),
        blockRules: newBlockRules(opts),
    }
}
