import {Renderer} from "./renderer";
import {StringStream} from "./source";
import {latex_md, math_md} from "./data.test";
import {Parser} from "./parser";
import {newRules} from "./rules";


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
    })
});


