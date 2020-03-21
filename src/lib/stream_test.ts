import {ErrorWithPos, Pos, StringStream} from "./stream";

import * as chai from 'chai';

const expect = chai.expect;
describe(
    'stream', () => {
        it('calculate correct pos', () => {
            expect((new StringStream('a').forward(1)).report()).to.be.equal('<line:1,column:1>');
            expect((new StringStream('\n').forward(1)).report()).to.be.equal('<line:2,column:0>');
            expect((new StringStream('a\na').forward(2)).report()).to.be.equal('<line:2,column:0>');
        });

        function posTest(s: string, {expected, relPos}: { expected: Pos, relPos?: Pos }) {

            let err: ErrorWithPos | undefined;
            try {
                // noinspection ExceptionCaughtLocallyJS
                throw (new StringStream(s).forward(s.length)).wrapErr(new Error("qwq"), relPos);
            } catch (e) {
                err = e;
            }
            expect(err).be.not.undefined;
            expect(err?.line).to.be.equal(expected.line);
            expect(err?.column).to.be.equal(expected.column);
        }

        it('decorate good pos', () => {
            posTest('', {
                expected: {line: 1, column: 0},
            });
        });
        it('decorate good relative pos', () => {

            posTest('qwq', {
                expected: {line: 1, column: 3},
                relPos: {line: 1, column: 0},
            });
            posTest('qwq', {
                expected: {line: 1, column: 4},
                relPos: {line: 1, column: 1},
            });
            posTest('qwq', {
                expected: {line: 2, column: 3},
                relPos: {line: 2, column: 0},
            });
            posTest('qwq', {
                expected: {line: 2, column: 5},
                relPos: {line: 2, column: 2},
            });
            posTest('\nqwq', {
                expected: {line: 2, column: 3},
                relPos: {line: 1, column: 0},
            });
            posTest('\nqwq', {
                expected: {line: 3, column: 3},
                relPos: {line: 2, column: 2},
            });
        })
    }
);