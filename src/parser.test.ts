import {createContext} from "./test_util";
import {StringStream} from "./source";
import {cn_book_md, math_md} from "./data.test";


describe(
    'parser', () => {
        let ctx = createContext();
        it('process math.md', () => {
            console.log(ctx.parseBlockElements(new StringStream(math_md)));
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