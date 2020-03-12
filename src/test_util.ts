import {blockRules, inlineRules, Rule, RuleContext, validTags} from "./rules";
import {StringStream} from "./source";
import {Parser} from "./parser";

import * as chai from 'chai';
import Benchmark = require("benchmark");

export const expect = chai.expect;
export type elementMatcher = ({text, matchedLength: number, expectedElement}: { text: string, matchedLength: number, expectedElement: any }) => void;
export type textAcceptor = ({text}: { text: string }) => void;

export function createContext(): Parser {
    return new Parser({inlineRules, blockRules}, {validTags});
}

export function itWillMatchElement(rule: Rule, ctx: RuleContext = createContext()): elementMatcher {
    return ({text, matchedLength, expectedElement}: { text: string, matchedLength: number, expectedElement: any }) => {
        it('will match ' + text, () => {
            let stream = new StringStream(text);
            expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            expect(stream.pos).to.equal(matchedLength);
        })
    }
}

export function itWillNotMatchElement(rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({text}: { text: string }) => {
        it('will not match ' + text, () => {
            expect(rule.match(new StringStream(text), ctx)).to.undefined;
        })
    }
}

export function benchText(suite: Benchmark.Suite, rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({text}: { text: string }) => {
        suite.add("test match " + text, () => {
            rule.match(new StringStream(text), ctx);
        });
    }
}


export function onRun(rule: Rule, callback: (runner: textAcceptor) => void) {

    let suite = new Benchmark.Suite;
    callback(benchText(suite, rule));
    suite.on('cycle', function (event: Benchmark.Event) {
        console.log(String(event.target));
    }).run({'async': true});
}