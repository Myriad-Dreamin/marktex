import {onRun} from "../lib/util.test";
import {ListBlockRule} from "./std";

onRun(new ListBlockRule({enableGFMRules: false}), function (runner) {

    runner({text: '* a'});
// 2150ns per op;
    runner({text: '* a\n\n* b'});
    runner({text: '* a\n\n* b\n\n* b\n\n* b\n\n* b'});
});
