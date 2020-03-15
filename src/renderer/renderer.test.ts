import {Renderer} from "./renderer";
import {Parser, StringStream} from "..";
import {latex_md, math_md} from "../lib/data.test";
import {newRules} from "../rules";


// console.log(new Renderer(new Parser({
// inlineRules: newInlineRules({enableLaTeX: true}),})).render(
//     new StringStream(code_md),
// ));
describe('renderer', () => {
    it('should render math.md', () => {
        console.log(new Renderer(new Parser(newRules({enableLaTeX: true})), {enableLaTeX: true}).render(
            new StringStream(math_md),
        ));
    });
    it('should render latex.md', () => {
        console.log(new Renderer(new Parser(newRules({enableLaTeX: true})), {enableLaTeX: true}).render(
            new StringStream(latex_md),
        ));
    });

    // it('should render test.md', () => {
    //     console.log(new Renderer(new Parser(newRules({enableLaTeX: true})), {enableLaTeX: true}).render(
    //         new StringStream(test_md),
    //     ));
    // });

    it('should render code block with escape', () => {
        console.log(new Renderer(new Parser(newRules({enableLaTeX: true})), {enableLaTeX: true}).render(
            new StringStream('    <div class="footer">\n' +
                '        &copy; 2004 Foo Corporation\n' +
                '    </div>'),
        ));
    });

});


