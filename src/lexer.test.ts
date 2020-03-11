import {createContext} from "./test_util";
import {StringStream} from "./source";
import {cn_book_md, math_md} from "./data.test";


describe(
    'lexer', () => {
        let ctx = createContext();
        it('process math.md', () => {
            console.log(ctx.lexBlockElements(new StringStream(math_md)));
        });
        it('process data.md', () => {
            console.log(JSON.stringify(ctx.lexBlockElements(new StringStream(cn_book_md)), undefined, 2));
        });

        it('process hr/list-break', () => {

            console.log(JSON.stringify(ctx.lexBlockElements(new StringStream('* hello\n' +
                'world\n' +
                '* how\n' +
                'are\n' +
                '* * *\n' +
                'you today?')), undefined, 2));
        })
    }
);