import {Renderer} from "./renderer";
import {createContext} from "./test_util";
import {StringStream} from "./source";
import {math_md} from "./data.test";

console.log(new Renderer(createContext()).render(
    new StringStream(math_md),
));
// console.log(new Renderer(createContext(), {}).render(
//     new StringStream(cn_book_md),
// ));


