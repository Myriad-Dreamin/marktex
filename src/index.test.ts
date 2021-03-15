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
        console.log(myriad.newRenderDriver().renderString('## hello marktex.js'))
    });
    it('can render by default parser option', () => {
        const driver = new myriad.RenderDriver(myriad.newParser(), myriad.newRenderer());
        console.log(driver.renderString('## hello marktex.js'))
    });

    it('can render by default parser option', () => {
        let _ = myriad.newRenderDriver({enableLaTeX: true});

        console.log(_.renderString('## hello marktex.js'))
    })
});

