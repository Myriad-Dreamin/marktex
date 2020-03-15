"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringStream {
    constructor(source) {
        this._source = source;
        this._pos = 0;
    }
    get source() {
        return this._source;
    }
    at(index) {
        return this._source[index];
    }
    get pos() {
        return this._pos;
    }

    get eof() {
        return this._source === "";
    }

    forward(n = 1) {
        this._pos = this._pos + Math.min(n, this._source.length);
        this._source = this._source.substr(n);
        return this;
    }
}

exports.StringStream = StringStream;

function forwardRegexp(s, capturing) {
    s.forward(capturing[0].length);
}

exports.forwardRegexp = forwardRegexp;
