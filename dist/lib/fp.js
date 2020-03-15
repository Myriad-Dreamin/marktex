"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.compose = (g, f) => (i) => g(f(i));

function Id(i) {
    return i;
}

exports.Id = Id;

// maybeCompose = MaybeF
function maybeCompose(...fns) {
    return (fns.length == 0) ? Id : (fns.length == 1 ? fns[0] : function (i) {
        let j = fns[fns.length - 1](i);
        for (let k = fns.length - 2; k >= 0; k--) {
            if (j === undefined) {
                return undefined;
            }
            j = fns[k](j);
        }
        return j;
    });
}

exports.maybeCompose = maybeCompose;
