import {StringStream} from "./source";
import {cn_book_md, latex_md, math_md} from "./data.test";
import {Parser} from "./parser";
import {newInlineRules} from "./rules";


describe(
    'parser', () => {
        let ctx = new Parser({
            inlineRules: newInlineRules({enableLaTeX: true}),
        });
        it('process math.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(math_md)), undefined, 2));
        });
        it('process latex.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(latex_md)), undefined, 2));
        });
        it('process data.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(cn_book_md)), undefined, 2));
        });

        it('process hr/list-break', () => {

            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream('* hello\n' +
                'world\n' +
                '* how\n' +
                'are\n' +
                '* * *\n' +
                'you today?')), undefined, 2));
        })
    }
);