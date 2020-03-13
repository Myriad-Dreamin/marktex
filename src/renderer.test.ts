import {Renderer} from "./renderer";
import {createContext} from "./test_util";
import {StringStream} from "./source";
import {cn_book_md} from "./data.test";


// console.log(new Renderer(createContext()).render(
//     new StringStream(code_md),
// ));

console.log(new Renderer(createContext(), {enableLaTeX: true}).render(
    new StringStream(cn_book_md),
));


