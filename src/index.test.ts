import {myriad} from './index';
import * as chai from 'chai';

const expect = chai.expect;

describe('author', () => {
    it('must be Myriad-Dreamin', () => {
        expect(myriad.author).to.equal('Myriad-Dreamin');
    })
});

describe('renderer', () => {
    it('can render with default option', () => {
        console.log(myriad.newRenderer().renderString('## hello marktex.js'))
    });
    it('can render by default parser option', () => {
        console.log((new myriad.Renderer(myriad.newParser())).renderString('## hello marktex.js'))
    });

    it('can render by default parser option', () => {
        let _  = myriad.newRenderer({enableLaTeX: true});

        console.log(_.renderString('## hello marktex.js'))
    })
});

