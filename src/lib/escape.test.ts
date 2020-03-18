import * as chai from 'chai';
import {unescapeBackSlash} from "./escape";


export const expect = chai.expect;
describe('unescape backslash', () => {
        it('with std rule', () => {
            expect(unescapeBackSlash("a")).to.equal("a");
            expect(unescapeBackSlash("\\a")).to.equal("\\a");
            expect(unescapeBackSlash("\\\\a")).to.equal("\\a");
            expect(unescapeBackSlash("\\\\\\a")).to.equal("\\\\a");
            expect(unescapeBackSlash("\\!")).to.equal("!");
            expect(unescapeBackSlash("\\\\!")).to.equal("\\!");
            expect(unescapeBackSlash("\\\\\\!")).to.equal("\\!");
        })
    }
);