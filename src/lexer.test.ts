import {createContext} from "./test_util";
import {StringStream} from "./source";
import {cn_book_md, math_md} from "./data.test";


describe(
    'lexer', () => {
        it('process math.md', () => {
            let ctx = createContext();
            console.log(ctx.lexBlockElements(new StringStream(math_md)));
        });
        it('process data.md', () => {
            let ctx = createContext();
            console.log(JSON.stringify(ctx.lexBlockElements(new StringStream(cn_book_md)), undefined, 2));
        });
    }
);