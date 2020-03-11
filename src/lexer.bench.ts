import Benchmark = require("benchmark");
import {createContext} from "./test_util";
import {cn_book_md, math_md} from "./data.test";
import {StringStream} from "./source";

let suite = new Benchmark.Suite;

let ctx = createContext();


// lex math_md x 132,472 ops/sec ±0.59% (94 runs sampled)
// lex cn_book_md x 820 ops/sec ±0.84% (93 runs sampled)
suite.add('lex math_md', () => {
    ctx.lexBlockElements(new StringStream(math_md));
});

suite.add('lex cn_book_md', () => {
    ctx.lexBlockElements(new StringStream(cn_book_md));
});


suite.on('cycle', function (event: Benchmark.Event) {
    console.log(String(event.target));
}).run({'async': true});