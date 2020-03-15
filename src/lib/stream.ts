class StringStream {
    private _source: string;
    private _pos: number;

    constructor(source: string) {
        this._source = source;
        this._pos = 0;
    }

    get source(): string {
        return this._source;
    }

    at(index: number): string {
        return this._source[index];
    }

    get pos(): number {
        return this._pos
    }

    get eof(): boolean {
        return this._source === "";
    }

    forward(n: number = 1) {
        this._pos = this._pos + Math.min(n, this._source.length);
        this._source = this._source.substr(n);
        return this;
    }
}

export {StringStream};

export function forwardRegexp(s: StringStream, capturing: RegExpExecArray) {
    s.forward(capturing[0].length)
}