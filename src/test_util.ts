import {Rule, RuleContext} from "./rules";
import {StringStream} from "./source";
import {Parser} from "./parser";

import * as chai from 'chai';
import Benchmark = require("benchmark");

export const expect = chai.expect;
export type elementMatcher = ({title, text, matchedLength: number, expectedElement}:
                                  { title?: string, text: string, matchedLength: number, expectedElement: any }) => void;
export type textAcceptor = ({text, title}: { text: string, title?: string }) => void;

export function createContext(): Parser {
    return new Parser();
}

export function itWillMatchElement(rule: Rule, ctx: RuleContext = createContext()): elementMatcher {
    return ({title, text, matchedLength, expectedElement}:
                { title?: string, text: string, matchedLength: number, expectedElement: any }) => {
        it(title ? title : ('will match ' + text), () => {
            let stream = new StringStream(text);
            expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            expect(stream.pos).to.equal(matchedLength);
        })
    }
}

export function itWillNotMatchElement(rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({title, text}: { title?: string, text: string }) => {
        it(title ? title : ('will not match ' + text), () => {
            expect(rule.match(new StringStream(text), ctx)).to.be.equal(undefined);
        })
    }
}

export function benchText(suite: Benchmark.Suite, rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({title, text}: { title?: string, text: string }) => {
        suite.add(title ? title : ('test match ' + text), () => {
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