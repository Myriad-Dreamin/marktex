"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

class RegExpWithTagName extends RegExp {
    constructor(r, gIndex) {
        super(r);
        this.gIndex = gIndex;
    }

    // noinspection JSUnusedGlobalSymbols
    getTagName(g) {
        return g[this.gIndex];
    }
}

exports.RegExpWithTagName = RegExpWithTagName;

class OpenTagRegExp extends RegExpWithTagName {
    constructor(r, gIndex, gOpenIndex) {
        super(r, gIndex);
        this.gOpenIndex = gOpenIndex;
    }

    isSingleton(g) {
        return g[this.gOpenIndex] !== '/';
    }
}

exports.OpenTagRegExp = OpenTagRegExp;
