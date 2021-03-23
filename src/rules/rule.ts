
import { IStringStream } from "../lib/stream";
import {BlockElement, InlineElement, MaybeToken} from "../token/token";


export interface RuleContext {

    parseBlockElement(source: IStringStream): BlockElement

    parseInlineElement(source: IStringStream): InlineElement

    parseBlockElements(source: IStringStream): BlockElement[]

    parseInlineElements(source: IStringStream): InlineElement[]
}


export interface Rule {
    readonly name?: string
    readonly description?: string

    match: (s: IStringStream, ctx: RuleContext) => MaybeToken
}

