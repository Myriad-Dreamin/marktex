import {onRun} from "../lib/test_util";
import {ListBlockRule} from "./std";

onRun(new ListBlockRule(), function (runner) {

    runner({text: '* a'});
// 2150ns per op;
    runner({text: '* a\n\n* b'});
    runner({text: '* a\n\n* b\n\n* b\n\n* b\n\n* b'});
});
