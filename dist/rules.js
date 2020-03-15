"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const std_1 = require("./rules/std");
const latex_1 = require("./rules/latex");
const gfm_1 = require("./rules/gfm");
function validTags() {
    let _validTags = undefined;
    return () => {
        if (_validTags !== undefined) {
            return _validTags;
        }
        let validTags = /^<open_tag>|<close_tag>|<comment>|<processing_instruction>|<declaration>|<cdata>/.source;
        let open_tag = /(?:<(<tag_name>)(?:\s*<attribute>)*\s*(\/?)>)/.source;
        let close_tag = /(?:<\/(<tag_name>)\s*>)/.source;
        let comment = /(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)/;
        let processing_instruction = /(?:<?(?:(?!\?>).)*\?>)/;
        let declaration = /(?:<![A-Z]+[^>]*>)/;
        let cdata = /(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/;
        let tag_name = /(?:[a-zA-Z][a-zA-Z0-9-]*)/;
        let attribute = /(?:<attribute_name>(?:\s*=\s*<attribute_value>)?)/.source;
        let attribute_name = /(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)/;
        let attribute_value = /(?:[^/s'"=<>`]|'[^']*'|"[^"]*")/;
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
        _validTags = {
            validTags: new RegExp(validTags),
            open_tag: new std_1.OpenTagRegExp(new RegExp(open_tag), 1, 2),
            close_tag: new std_1.RegExpWithTagName(new RegExp(close_tag), 1),
            comment,
            others: [processing_instruction, declaration, cdata],
        };
        return _validTags;
    };
}
exports.inlineRules = newInlineRules();
exports.blockRules = newBlockRules();
let validTagsClosure;
// noinspection JSUnusedGlobalSymbols
function newBlockRules(opts) {
    let rules0 = [
        new std_1.NewLineRule(),
        new std_1.CodeBlockRule(),
        new std_1.LinkDefinitionRule(),
        new latex_1.MathBlockRule(),
        new latex_1.LatexBlockRule(),
    ];
    let rules1 = [
        new std_1.QuotesRule(),
        new std_1.HeaderBlockRule(),
        new std_1.HorizontalRule(),
        new std_1.ListBlockRule(),
    ];
    let rules2 = [
        new latex_1.ParagraphRule({
            skipLaTeXBlock: (opts === null || opts === void 0 ? void 0 : opts.enableLaTeX) || false,
            skipMathBlock: true
        }),
    ];
    // default enable
    if ((opts === null || opts === void 0 ? void 0 : opts.enableGFMRules) !== false) {
        rules0.push(new gfm_1.GFMFencedCodeBlockRule());
    }
    if (opts === null || opts === void 0 ? void 0 : opts.enableHtml) {
        if (!validTagsClosure) {
            validTagsClosure = validTags();
        }
        rules0.push(new std_1.HTMLBlockRule((opts === null || opts === void 0 ? void 0 : opts.validTags) || validTagsClosure()));
    }
    return [...rules0, ...rules1, ...rules2];
}
exports.newBlockRules = newBlockRules;
// noinspection JSUnusedGlobalSymbols
function newInlineRules(opts) {
    let rules0 = [
        new std_1.InlinePlainExceptSpecialMarksRule(),
        new std_1.LinkOrImageRule(),
        new latex_1.InlineMathRule(),
    ];
    let rules1 = [
        new std_1.EmphasisRule(),
        new std_1.InlineCodeRule(),
        new std_1.InlinePlainRule(),
    ];
    // default not enable
    if ((opts === null || opts === void 0 ? void 0 : opts.enableLaTeX) !== false) {
        rules0.push(new latex_1.InlineLatexCommandRule());
    }
    return [...rules0, ...rules1];
}
exports.newInlineRules = newInlineRules;
function newRules(opts) {
    return {
        inlineRules: newInlineRules(opts),
        blockRules: newBlockRules(opts),
    };
}
exports.newRules = newRules;
