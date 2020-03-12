"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const rules_1 = require("./rules");
const source_1 = require("./source");
const parser_1 = require("./parser");
const chai = require("chai");
const Benchmark = require("benchmark");
exports.expect = chai.expect;

function createContext() {
    return new parser_1.Parser({
        inlineRules: rules_1.inlineRules,
        blockRules: rules_1.blockRules
    }, {validTags: rules_1.validTags});
}

exports.createContext = createContext;

function itWillMatchElement(rule, ctx = createContext()) {
    return ({text, matchedLength, expectedElement}) => {
        it('will match ' + text, () => {
            let stream = new source_1.StringStream(text);
            exports.expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            exports.expect(stream.pos).to.equal(matchedLength);
        });
    };
}

exports.itWillMatchElement = itWillMatchElement;

function itWillNotMatchElement(rule, ctx = createContext()) {
    return ({text}) => {
        it('will not match ' + text, () => {
            exports.expect(rule.match(new source_1.StringStream(text), ctx)).to.undefined;
        });
    };
}

exports.itWillNotMatchElement = itWillNotMatchElement;

function benchText(suite, rule, ctx = createContext()) {
    return ({text}) => {
        suite.add("test match " + text, () => {
            rule.match(new source_1.StringStream(text), ctx);
        });
    };
}

exports.benchText = benchText;

function onRun(rule, callback) {
    let suite = new Benchmark.Suite;
    callback(benchText(suite, rule));
    suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).run({'async': true});
}

exports.onRun = onRun;
