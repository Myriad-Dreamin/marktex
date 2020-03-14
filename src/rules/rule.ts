import {StringStream} from "../source";
import {BlockElement, InlineElement, MaybeToken} from "../token";


export interface RuleContext {

    parseBlockElement(source: StringStream): BlockElement

    parseInlineElement(source: StringStream): InlineElement

    parseBlockElements(source: StringStream): BlockElement[]

    parseInlineElements(source: StringStream): InlineElement[]
}


export interface Rule {
    readonly name?: string
    readonly description?: string

    match: (s: StringStream, ctx: RuleContext) => MaybeToken
}

