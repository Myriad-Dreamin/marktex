export interface Pos {
    line: number;
    column: number;
}

export interface MaybePos {
    line?: number;
    column?: number;
}

export interface ErrorWithMaybePos extends Error, MaybePos {
}

export interface ErrorWithPos extends Error, Pos {
}

class StringStream {
    private _source: string;
    private _pos: number;
    private line: number;
    private column: number;

    constructor(source: string, line: number = 1, column: number = 0) {
        this._source = source;
        this._pos = 0;
        this.line = line;
        this.column = column;
    }

    breakAt(n: number) {
        const stream = new StringStream(this.source.slice(0, n), this.line, this.column);
        this.forward(n);
        return stream;
    }

    maybeBreakAt(n: number) {
        return n === -1 ? this : this.breakAt(n);
    }

    get source(): string {
        return this._source;
    }

    get length(): number {
        return this._source.length;
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
        let shiftLength = Math.min(n, this._source.length);
        this._pos += shiftLength;
        for (let i = 0; i < shiftLength; i++) {
            if (this._source[i] === '\n') {
                this.line++;
                this.column = 0;
            } else {
                this.column++;
            }
        }
        this._source = this._source.substr(n);
        return this;
    }

    report() {
        return `<line:${this.line},column:${this.column}>`;
    }

    wrapErr<T extends ErrorWithMaybePos>(err: T, relPos?: Pos): ErrorWithPos {

        err.line = this.line;
        err.column = this.column;
        if (relPos) {
            err.line += relPos.line - 1;
            if (this.line == 1) {
                err.column += relPos.column;
            }
        }
        return <ErrorWithPos>err;
    }
}

export {StringStream};

export function forwardRegexp(s: StringStream, capturing: RegExpExecArray): void {
    s.forward(capturing[0].length);
}