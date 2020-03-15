"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("./stream");
const __1 = require("..");
const chai = require("chai");
const Benchmark = require("benchmark");
exports.expect = chai.expect;
function createContext() {
    return new __1.Parser();
}
exports.createContext = createContext;
function itWillMatchElement(rule, ctx = createContext()) {
    return ({ title, text, matchedLength, expectedElement }) => {
        it(title ? title : ('will match ' + text), () => {
            let stream = new stream_1.StringStream(text);
            exports.expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            exports.expect(stream.pos).to.equal(matchedLength);
        });
    };
}
exports.itWillMatchElement = itWillMatchElement;
function itWillNotMatchElement(rule, ctx = createContext()) {
    return ({ title, text }) => {
        it(title ? title : ('will not match ' + text), () => {
            exports.expect(rule.match(new stream_1.StringStream(text), ctx)).to.be.equal(undefined);
        });
    };
}
exports.itWillNotMatchElement = itWillNotMatchElement;
function benchText(suite, rule, ctx = createContext()) {
    return ({ title, text }) => {
        suite.add(title ? title : ('test match ' + text), () => {
            rule.match(new stream_1.StringStream(text), ctx);
        });
    };
}
exports.benchText = benchText;
function onRun(rule, callback) {
    let suite = new Benchmark.Suite;
    callback(benchText(suite, rule));
    suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).run({ 'async': true });
}
exports.onRun = onRun;
