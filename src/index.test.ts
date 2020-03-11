import {myriad} from './index';
import * as chai from 'chai';

const expect = chai.expect;

describe('author', () => {
    it('must be Myriad-Dreamin', () => {
        expect(myriad.author).to.equal('Myriad-Dreamin');
    })
});

