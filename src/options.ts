export class RegExpWithTagName extends RegExp {
    protected gIndex: number;

    constructor(r: RegExp, gIndex: number) {
        super(r);
        this.gIndex = gIndex;
    }

    // noinspection JSUnusedGlobalSymbols
    getTagName(g: RegExpExecArray): string {
        return g[this.gIndex];
    }
}

export class OpenTagRegExp extends RegExpWithTagName {
    protected gOpenIndex: number;

    constructor(r: RegExp, gIndex: number, gOpenIndex: number) {
        super(r, gIndex);
        this.gOpenIndex = gOpenIndex;
    }

    isSingleton(g: RegExpExecArray): boolean {
        return g[this.gOpenIndex] !== '/'
    }
}


export interface HTMLTagsRegexps {
    validTags: RegExp,
    open_tag: OpenTagRegExp,
    close_tag: RegExpWithTagName,
    comment: RegExp,
    others: RegExp[],
}

export interface RuleOptions {
    validTags: HTMLTagsRegexps
}


