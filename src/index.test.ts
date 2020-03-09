import {author} from './index';
import * as chai from 'chai';

const expect = chai.expect;

describe('author', () => {
    it('author must be Myriad-Dreamin', () => {
        expect(author).to.equal('Myriad-Dreamin');
    })
});

