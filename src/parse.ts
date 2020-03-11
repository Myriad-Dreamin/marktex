import {MaybeToken, Token} from "./token";


type parseHandler = (b: Token) => MaybeToken

const parseHandlers: parseHandler[] = [];

export {
    parseHandler,
    parseHandlers,
}

