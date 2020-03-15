import Benchmark = require("benchmark");
import {cn_book_md, math_md} from "../lib/data.test";
import {StringStream} from "..";
import {Parser} from "./parser";
import {newRules} from "../rules";

let suite = new Benchmark.Suite;

let ctx = new Parser(newRules({enableLaTeX: true}));


// parse math_md x 132,472 ops/sec ±0.59% (94 runs sampled)
// parse cn_book_md x 820 ops/sec ±0.84% (93 runs sampled)

// after add latex option
// parse math_md x 105,434 ops/sec ±0.61% (91 runs sampled)
// parse cn_book_md x 676 ops/sec ±0.34% (94 runs sampled)
suite.add('parse math_md', () => {
    ctx.parseBlockElements(new StringStream(math_md));
});

suite.add('parse cn_book_md', () => {
    ctx.parseBlockElements(new StringStream(cn_book_md));
});


suite.on('cycle', function (event: Benchmark.Event) {
    console.log(String(event.target));
}).run({'async': true});