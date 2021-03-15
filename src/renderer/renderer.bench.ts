import {Parser, StringStream} from "..";
import {cn_book_md, math_md} from "../lib/data.test";
import {newRules} from "../rules";
import {RenderDriver} from "../driver/driver";
import {Renderer} from "./renderer";
import Benchmark = require("benchmark");

let suite = new Benchmark.Suite;
// renderer math_md x 96,677 ops/sec ±0.40% (95 runs sampled)
// renderer cn_book_md x 656 ops/sec ±1.06% (94 runs sampled)

suite.add('render math_md', () => {
    new RenderDriver(new Parser(), new Renderer()).render(
        new StringStream(math_md),
    );
});

suite.add('render cn_book_md', () => {
    new RenderDriver(new Parser(), new Renderer(), {}).render(
        new StringStream(cn_book_md),
    );
});

let latexRenderer = new RenderDriver(new Parser(newRules({enableLaTeX: true})), new Renderer({enableLaTeX: true}));

// render math_md with latex option x 79,236 ops/sec ±1.12% (95 runs sampled)
// render cn_book_md with latex option x 610 ops/sec ±0.94% (92 runs sampled)

suite.add('render math_md with latex option', () => {
    latexRenderer.render(
        new StringStream(math_md),
    );
});

suite.add('render cn_book_md with latex option', () => {
    latexRenderer.render(
        new StringStream(cn_book_md),
    );
});


suite.on('cycle', function (event: Benchmark.Event) {
    console.log(String(event.target));
}).run({'async': true});
