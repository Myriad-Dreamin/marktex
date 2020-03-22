import {StringStream} from "..";

enum TokenType {
    Paragraph,
    NewLine,
    Quotes,
    ListBlock,
    Horizontal,
    LinkDefinition,
    CodeBlock,
    HTMLBlock,
    HeaderBlock,

    InlinePlain,
    Link,
    ImageLink,
    Emphasis,
    InlineCode,

    MathBlock,
    LatexBlock,
}

// noinspection JSUnusedGlobalSymbols
const StdBlockTokenL = TokenType.Paragraph, StdBlockTokenR = TokenType.HeaderBlock + 1,
    StdInlineTokenL = TokenType.InlinePlain, StdInlineTokenR = TokenType.InlineCode + 1,
    StdBlockTokenCount: number = StdBlockTokenR - StdBlockTokenL,
    StdInlineTokenCount: number = StdInlineTokenR - StdInlineTokenL;


//Markdown provides backslash escapes for the following characters:
//
// \   backslash
// `   backtick
// *   asterisk
// _   underscore
// {}  curly braces
// []  square brackets
// ()  parentheses
// #   hash mark
// +   plus sign
// -   minus sign (hyphen)
// .   dot
// !   exclamation mark

interface Token {
    readonly token_type: number;
}

type MaybeToken = Token | undefined

interface BlockElement extends Token {
}

interface InlineElement extends Token {
}

class NewLine implements BlockElement {
    readonly token_type = TokenType.NewLine;
    public content: string;

    constructor(content: string) {
        this.content = content;
    }
}


/*
(.*\n{1...1})+

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines. (
A blank line is any line that looks like a blank line — a line containing nothing but spaces or
tabs is considered blank.) Normal paragraphs should not be indented with spaces or tabs.
*/
class Paragraph implements BlockElement {
    readonly token_type = TokenType.Paragraph;
    public inlineElements: InlineElement[];

    constructor(inlineElements: InlineElement[]) {
        this.inlineElements = inlineElements;
    }
}

/*
> (inside line1...)
>?
> (inside line2...)
...

Markdown uses email-style > characters for block-quoting. If you're familiar with quoting passages
of text in an email message, then you know how to create a blockquote in Markdown. It looks best if
you hard wrap the text and put a > before every line:

> This is a blockquote with two paragraphs. The quick brown fox jumps over the lazy dog. The quick
> brown fox jumps over the lazy dog.
>
> The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
> quick brown fox jumps over the lazy dog.

Markdown allows you to be lazy and only put the > before the first line of a hard-wrapped paragraph:

> This is a blockquote with two paragraphs. The quick brown fox jumps over the lazy dog. The quick
> brown fox jumps over the lazy dog.

> The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
> quick brown fox jumps over the lazy dog.

Block-quotes can be nested (i.e. a blockquote-in-a-blockquote) by adding additional levels of >:

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

Block-quotes can contain other Markdown elements, including headers, lists, and code blocks:

> ## This is a header.
>
> 1.   This is the first list item.
> 2.   This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

*/
class Quotes implements BlockElement {
    readonly token_type = TokenType.Quotes;
    public insideTokens: BlockElement[];

    constructor(tokens: BlockElement[]) {
        this.insideTokens = tokens;
    }
}


class ListElement {
    public innerBlocks: BlockElement[];
    public marker: string;
    // is it good?
    public blankSeparated: boolean;

    constructor(marker: string, innerBlocks: BlockElement[] = [], blankSeparated: boolean = false) {
        this.marker = marker;
        this.innerBlocks = innerBlocks;
        this.blankSeparated = blankSeparated;
    }
}

/*
let m = [*+-]
1.
    m (inside blocks1...)
    ?
    m (inside blocks2...)
    ...



Unordered lists use asterisks, pluses, and hyphens — interchangably — as list markers:

*   Red
*   Green
*   Blue

Ordered lists use numbers followed by periods:

1.  Bird
2.  McHale
3.  Parish

It's important to note that the actual numbers you use to mark the list have no effect on the HTML
output Markdown produces.

you’d get the exact same HTML output. The point is, if you want to, you can use ordinal numbers in
your ordered Markdown lists, so that the numbers in your source match the numbers in your
published HTML. But if you want to be lazy, you don’t have to.

To make lists look nice, you can wrap items with hanging indents:

*   This is a blockquote with two paragraphs. The quick brown fox jumps over the lazy dog. The
    quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
    brown fox jumps over the lazy dog.

*   The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
    quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

But if you want to be lazy, you don’t have to:

*   This is a blockquote with two paragraphs. The quick brown fox jumps over the lazy dog. The
quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
brown fox jumps over the lazy dog.

*   The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

If list items are separated by blank lines, Markdown will wrap the items in <p> tags in the HTML
output. For example, this input:

*   Bird
*   Magic

will turn into:

<ul>
<li>Bird</li>
<li>Magic</li>
</ul>

But this:

*   Bird

*   Magic

will turn into:

<ul>
<li><p>Bird</p></li>
<li><p>Magic</p></li>
</ul>

List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be
indented by either 4 spaces or one tab:

1.  This is a blockquote with two paragraphs. The quick brown fox jumps over the lazy dog. The
    quick brown fox jumps over the lazy dog.

    The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
    quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

2.  The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
    quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

It looks nice if you indent every line of the subsequent paragraphs, but here again, Markdown will
allow you to be lazy.

To put a blockquote within a list item, the blockquote’s > delimiters need to be indented.

To put a code block within a list item, the code block needs to be indented twice — 8 spaces or two
tabs.

a number-period-space sequence at the beginning of a line. To avoid this, you can backslash-escape
the period.
*/
class ListBlock implements BlockElement {
    readonly token_type = TokenType.ListBlock;
    public listElements: ListElement[];
    public ordered: boolean;

    constructor(ordered: boolean, listElements: ListElement[] = []) {
        this.listElements = listElements;
        this.ordered = ordered;
    }

    public lookAhead(s: StringStream): string | undefined {
        if (this.ordered) {
            return ListBlock.lookAheadOrderedListNumber(s);
        } else {
            return ListBlock.lookAheadUnorderedListMarker(s);
        }
    }

    public lookAhead0(s: StringStream): boolean {
        if (this.ordered) {
            return '0' <= s.source[0] && s.source[0] <= '9'
        } else if ('*+-'.includes(s.source[0])) {
            let j = 0;
            for (let i = 0; s.source[i] && s.source[i] != '\n'; i++) {
                if (s.source[i] == s.source[0]) {
                    j++;
                } else if (!'\t\r\v\f '.includes(s.source[i])) {
                    j = 0;
                    break;
                }
            }
            return j < 3;
        }
        return false;
    }

    public static lookAheadOrderedListNumber(s: StringStream): string | undefined {
        for (let i = 0; ; i++) {
            if ('0' <= s.source[i] && s.source[i] <= '9') {
                continue;
            }
            if (s.source[i] == '.' && s.source[i + 1] == ' ') {
                let m: string = s.source.substr(0, i);
                s.forward(i + 2);
                return m;
            }
            return undefined;
        }
    }

    public static lookAheadUnorderedListMarker(s: StringStream): string | undefined {
        if ('*+-'.includes(s.source[0]) && s.source[1] == ' ') {
            let m: string = s.source[0];
            s.forward(2);
            return m;
        }
        return undefined;
    }
}

class Horizontal implements BlockElement {
    readonly token_type = TokenType.Horizontal;

    constructor() {
    }
}

/*
+   Square brackets containing the link identifier (optionally indented from the left margin using up
    to three spaces);
+   followed by a colon;
+   followed by one or more spaces (or tabs);
+   followed by the URL for the link;
+   optionally followed by a title attribute for the link, enclosed in double or single quotes, or
    enclosed in parentheses.

The following three link definitions are equivalent:

[foo]: http://example.com/  "Optional Title Here"
[foo]: http://example.com/  'Optional Title Here'
[foo]: http://example.com/  (Optional Title Here)
*/
class LinkDefinition implements BlockElement {
    readonly token_type = TokenType.LinkDefinition;
    public linkIdentifier: string;
    public url: string;
    public title?: string;


    constructor(linkIdentifier: string, url: string, title?: string) {
        this.linkIdentifier = linkIdentifier;
        this.url = url;
        this.title = title;
    }
}


/*
    (.*\n)+
    (.*\n)+
    ...

Within a code block, ampersands (&) and angle brackets (< and >) are automatically converted into
HTML entities. This makes it very easy to include example HTML source code using Markdown — just
paste it and indent it, and Markdown will handle the hassle of encoding the ampersands and angle
brackets.
*/
class CodeBlock implements BlockElement {
    readonly token_type = TokenType.CodeBlock;
    public body: string;
    public language?: string;

    constructor(body: string, language?: string) {
        this.body = body;
        this.language = language;
    }
}


/*
<any>...<any>

For example, to add an HTML table to a Markdown article:
This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.
*/
class HTMLBlock implements BlockElement {
    readonly token_type = TokenType.HTMLBlock;
    public body: string;

    constructor(body: string) {
        this.body = body;
    }
}


/*
1.
    .*\n[=-]{1...}
2.
    #{1...6} .*\n #{1...}

Markdown supports two styles of headers, Setext and atx.

Setext-style headers are “underlined” using equal signs (for first-level headers) and dashes (for
second-level headers). For example:

This is an H1
=============

This is an H2
-------------
Any number of underlining ='s or -'s will work.

Atx-style headers use 1-6 hash characters at the start of the line, corresponding to header levels
1-6. For example:

# This is an H1

## This is an H2

###### This is an H6

Optionally, you may “close” atx-style headers. This is purely cosmetic — you can use this if you
think it looks better. The closing hashes don't even need to match the number of hashes used to
open the header. (The number of opening hashes determines the header level.) :

# This is an H1 #

## This is an H2 ##

### This is an H3 ######
*/
class HeaderBlock implements BlockElement {
    readonly token_type = TokenType.HeaderBlock;
    public inlineElements: InlineElement[];
    public level: number;

    constructor(inlineElements: InlineElement[], level: number) {
        this.inlineElements = inlineElements;
        this.level = level;
    }
}


class InlinePlain implements InlineElement {
    readonly token_type = TokenType.InlinePlain;
    public content: string;

    constructor(content: string) {
        this.content = content;
    }
}


class Link implements InlineElement {
    readonly token_type = TokenType.Link;
    public linkTitle: string;
    public link: string;
    public inlineOrReference: boolean;
    public title?: string;

    constructor(linkTitle: string, link: string, inline: boolean, title?: string) {
        this.linkTitle = linkTitle;
        this.link = link;
        this.inlineOrReference = inline;
        this.title = title;
    }
}

class ImageLink implements InlineElement {
    readonly token_type = TokenType.ImageLink;
    public linkTitle: string;
    public link: string;
    public inlineOrReference: boolean;
    public title?: string;

    constructor(linkTitle: string, link: string, inline: boolean, title?: string) {
        this.linkTitle = linkTitle;
        this.link = link;
        this.inlineOrReference = inline;
        this.title = title;
    }
}


class Emphasis implements InlineElement {
    readonly token_type = TokenType.Emphasis;
    public content: string;
    public level: number; /* 1~2 */

    constructor(content: string, level: number) {
        this.content = content;
        this.level = level;
    }
}

class InlineCode implements InlineElement {
    readonly token_type = TokenType.InlineCode;
    public content: string;

    constructor(content: string) {
        this.content = content;
    }
}


class LateXBlock implements InlineElement {
    readonly token_type = TokenType.LatexBlock;

    public content: string;
    public inline?: boolean;

    constructor(content: string) {
        this.content = content;
    }
}


class MathBlock implements InlineElement {
    readonly token_type = TokenType.MathBlock;

    public content: string;
    public inline?: boolean;

    constructor(content: string, inline: boolean) {
        this.content = content;
        this.inline = inline;
    }
}


export {
    TokenType,
    Token,
    BlockElement,
    InlineElement,
    ListElement,
    MaybeToken,
}

export {
    Paragraph,
    NewLine,
    Quotes,
    ListBlock,
    Horizontal,
    LinkDefinition,
    CodeBlock,
    HTMLBlock,
    HeaderBlock,
    MathBlock,
    LateXBlock,

    InlinePlain,
    Link,
    ImageLink,
    Emphasis,
    InlineCode,

    StdBlockTokenCount,
    StdInlineTokenCount,
}