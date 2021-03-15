import {Parser, StringStream} from "..";
import {latex_md, math_md, test_md} from "../lib/data.test";
import {newRules} from "../rules";
import {RenderDriver} from "../driver/driver";
import {Renderer} from "./renderer";


// console.log(new Renderer(new Parser({
// inlineRules: newInlineRules({enableLaTeX: true}),})).render(
//     new StringStream(code_md),
// ));
describe('renderer', () => {
    let driver: RenderDriver;

    before(() => {
        const opts = {enableLaTeX: true};
        driver = new RenderDriver(new Parser(newRules(opts)), new Renderer(opts));
    })

    it('should render math.md', () => {
        console.log(driver.render(
            new StringStream(math_md),
        ));
    });
    it('should render latex.md', () => {
        console.log(driver.render(
            new StringStream(latex_md),
        ));
    });

    it('should render test.md', () => {
        console.log(driver.render(
            new StringStream(test_md),
        ));
    });

    it('should render code block with escape', () => {
        console.log(driver.render(
            new StringStream('    <div class="footer">\n' +
                '        &copy; 2004 Foo Corporation\n' +
                '    </div>'),
        ));
    });

    it('should render code block with highlight callback', () => {
        const opts = {
            enableLaTeX: true,
            highlight: (code: string, language: string) => {
                if (language) {
                    return '<div class="rendered">' + code + '</div>'
                } else {
                    return code
                }
            },
        };
        console.log(
            new RenderDriver(
                new Parser(newRules(opts)),
                new Renderer(opts)).render(
                new StringStream('```html\n' +
                    '<div class="footer">\n' +
                    '    &copy; 2004 Foo Corporation\n' +
                    '</div>\n' +
                    '```'),
            ));
    });

});


