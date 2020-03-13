"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const parser_1 = require("./parser");
const renderer_1 = require("./renderer");
// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    Parser(options) {
        return new parser_1.Parser(options === null || options === void 0 ? void 0 : options.parserOptions);
    },
    Renderer(options) {
        return new renderer_1.Renderer(myriad.Parser(options), options === null || options === void 0 ? void 0 : options.renderOptions);
    },
};
exports.myriad = myriad;
