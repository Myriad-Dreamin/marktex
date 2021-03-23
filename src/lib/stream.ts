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

export interface IStringStream {
    readonly source: string;
    length: number;
    readonly pos: number;
    readonly eof: boolean;
    readonly line: number;
    readonly column: number;
    clone(): IStringStream;
    breakAt(n: number): IStringStream;
    maybeBreakAt(n: number): IStringStream;
    at(index: number): string;
    forward(n?: number): IStringStream;
    report(): string;
    wrapErr<T extends ErrorWithMaybePos>(err: T, relPos?: Pos): ErrorWithPos;
}

class CombinedStringStream implements IStringStream {
    private _source: string;
    line: number;
    column: number;
    _pos: number;

    constructor(private streams: IStringStream[], fast_source?: string) {
        this._source = fast_source || this.streams.map(s => s.source).join('');
        this.line = 0;
        this.column = 0;
        this._pos = 0;
        if (streams.length) {
            this.line = streams[0].line;
            this.column = streams[0].column;
        }
    }

    clone(): IStringStream {
        return new CombinedStringStream(this.streams, this._source);
    }

    breakAt(n: number): IStringStream {
        let leftN = 0;
        let leftStreamIndex = 0;
        while(leftStreamIndex < this.streams.length && 
            leftN + this.streams[leftStreamIndex].source.length <= n) {
            leftN += this.streams[leftStreamIndex].source.length;
            leftStreamIndex++;
        }
        let middleLeftStream: IStringStream | undefined = undefined, 
            middleRightStream: IStringStream | undefined = undefined;
        if (leftStreamIndex < this.streams.length && this.streams[leftStreamIndex].length) {
            middleRightStream = this.streams[leftStreamIndex];
            middleLeftStream = middleRightStream.breakAt(n);
        }
        let stream: IStringStream;
        if (middleLeftStream) {
            stream = new CombinedStringStream([...this.streams.slice(0, leftStreamIndex), middleLeftStream]);
            this.streams = [middleRightStream!, ...this.streams.slice(leftStreamIndex+1)];
        } else {
            stream = new CombinedStringStream(this.streams.slice(0, leftStreamIndex));
            this.streams = this.streams.slice(leftStreamIndex);
        }
        this.forward(n);
        return stream;
    }
    maybeBreakAt(n: number): IStringStream {
        return this.breakAt(n === -1 ? this.length : n);
    }
    get source(): string {
        return this._source;
    }
    get length(): number {
        return this._source.length;
    }
    set length(n: number) {
        let leftN = 0;
        let leftStreamIndex = 0;
        while(leftStreamIndex < this.streams.length && 
            leftN + this.streams[leftStreamIndex].source.length <= n) {
            leftN += this.streams[leftStreamIndex].source.length;
            leftStreamIndex++;
        }
        let middleLeftStream: IStringStream | undefined = undefined, 
            middleRightStream: IStringStream | undefined = undefined;
        if (leftStreamIndex < this.streams.length && this.streams[leftStreamIndex].length) {
            middleRightStream = this.streams[leftStreamIndex];
            middleLeftStream = middleRightStream.breakAt(n);
        }
        if (middleLeftStream) {
            this.streams = [...this.streams.slice(0, leftStreamIndex), middleLeftStream];
        } else {
            this.streams = this.streams.slice(0, leftStreamIndex);
        }
        this._source = this._source.slice(0, n);
    }
    at(index: number): string {
        return this._source[index];
    }
    get pos(): number {
        return this._pos;
    }
    get eof(): boolean {
        return this._pos >= this._source.length;
    }
    forward(n: number = 1): IStringStream {
        while(n && this.streams.length) {
            if (n >= this.streams[0].length) {
                this._source = this._source.slice(this.streams[0].length);
                n -= this.streams[0].length;
                this.streams = this.streams.slice(1);
            } else {
                break;
            }
        }
        if (this.streams.length) {
            this.streams[0].forward(n);
            this._source = this._source.slice(n);
            this.line = this.streams[0].line;
            this.column = this.streams[0].column;
        } else {
            this.line = 0;
            this.column = 0;
        }
        return this;
    }
    report(): string {
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

class StringStream implements IStringStream {
    private _source: string;
    private _pos: number;
    line: number;
    column: number;

    clone(): IStringStream {
        return new StringStream(this._source, this.line, this.column);
    }

    static join(ss: IStringStream[]): IStringStream {
        return new CombinedStringStream(ss);
    }

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
        return this.breakAt(n === -1 ? this.length : n);
    }

    get source(): string {
        return this._source;
    }

    get length(): number {
        return this._source.length;
    }
    set length(n: number) {
        this._source = this._source.slice(0, n);
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

export function forwardRegexp(s: IStringStream, capturing: RegExpExecArray): void {
    s.forward(capturing[0].length);
}