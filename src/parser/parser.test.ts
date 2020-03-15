import {StringStream} from "..";
import {cn_book_md, latex_md, math_md} from "../lib/data.test";
import {Parser} from "./parser";
import {newRules} from "../rules";


describe(
    'parser', () => {
        let ctx = new Parser(newRules({enableLaTeX: true}));
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