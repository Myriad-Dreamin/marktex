import Benchmark = require('benchmark');
import {ListBlockRule} from "./rules";
import {benchText} from "./test_util";

let suite = new Benchmark.Suite;
let rule = new ListBlockRule();
let runner = benchText(suite, rule);
// 991ns per op;
runner({text: '* a'});
// 2150ns per op;
runner({text: '* a\n\n* b'});
runner({text: '* a\n\n* b\n\n* b\n\n* b\n\n* b'});
suite.on('cycle', function (event: Benchmark.Event) {
    console.log(String(event.target));
}).run({'async': true});