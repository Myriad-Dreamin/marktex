import {Render} from "./render";
import {createContext} from "./test_util";
import {StringStream} from "./source";
import {cn_book_md} from "./data.test";

// console.log(new Render(createContext(), {}).render(
//     new StringStream(math_md),
// ));
console.log(new Render(createContext(), {}).render(
    new StringStream(cn_book_md),
));


