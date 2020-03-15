"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const parser_1 = require("./parser/parser");
exports.Parser = parser_1.Parser;
const renderer_1 = require("./renderer/renderer");
exports.Renderer = renderer_1.Renderer;
const stream_1 = require("./lib/stream");
exports.StringStream = stream_1.StringStream;
const rules_1 = require("./rules");
// noinspection JSUnusedGlobalSymbols
const myriad = {
    author: "Myriad-Dreamin",
    newParser(options) {
        return new parser_1.Parser(options === null || options === void 0 ? void 0 : options.parserOptions);
    },
    newRenderer(options) {
        return new renderer_1.Renderer(myriad.newParser(options), options === null || options === void 0 ? void 0 : options.rendererOptions);
    },
    newStringStream(str) {
        return new stream_1.StringStream(str);
    },
    newInlineRules: rules_1.newInlineRules, newBlockRules: rules_1.newBlockRules, newRules: rules_1.newRules,
    Parser: parser_1.Parser, Renderer: renderer_1.Renderer, StringStream: stream_1.StringStream,
};
exports.myriad = myriad;
// noinspection JSUnusedGlobalSymbols
exports.default = myriad;
