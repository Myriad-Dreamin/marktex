import {newBlockRules, Rule, RuleContext} from "../rules";
import {StringStream} from "./stream";
import {Parser} from "..";

import * as chai from 'chai';
import * as crypto from 'crypto';
import Benchmark = require("benchmark");

export const expect = chai.expect;
export type elementMatcher = ({title, text, matchedLength: number, expectedElement}:
                                  { title?: string, text: string, matchedLength: number, expectedElement: any }) => void;
export type textAcceptor = ({text, title}: { text: string, title?: string }) => void;

const parser = new Parser({ blockRules: newBlockRules({ lazyParagraph: true }) });
export function createContext(): Parser {
    return parser;
}

export function testTitleString(text: string): string {
    text = text
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        .replace(/\f/g, '\\f');
    if (text.length < 15) {
        return text;
    }

    const hash = crypto.createHash('md5');
    const digest = hash.update(text).digest()
        .toString('hex').substr(0, 8);
    return `${text.substr(0, 8)} (${digest})`
}

export function itWillMatchElement(rule: Rule, ctx: RuleContext = createContext()): elementMatcher {
    return ({title, text, matchedLength, expectedElement}:
                { title?: string, text: string, matchedLength: number, expectedElement: any }) => {
        it(title ? title : ('will match ' + testTitleString(text)), () => {
            let stream = new StringStream(text);
            expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            expect(stream.pos).to.equal(matchedLength);
        })
    }
}

export function itWillNotMatchElement(rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({title, text}: { title?: string, text: string }) => {
        it(title ? title : ('will not match ' + testTitleString(text)), () => {
            expect(rule.match(new StringStream(text), ctx)).to.be.equal(undefined);
        })
    }
}

export function benchText(suite: Benchmark.Suite, rule: Rule, ctx: RuleContext = createContext()): textAcceptor {
    return ({title, text}: { title?: string, text: string }) => {
        suite.add(title ? title : ('test match ' + testTitleString(text)), () => {
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
