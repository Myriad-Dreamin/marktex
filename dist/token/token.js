"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Paragraph"] = 0] = "Paragraph";
    TokenType[TokenType["NewLine"] = 1] = "NewLine";
    TokenType[TokenType["Quotes"] = 2] = "Quotes";
    TokenType[TokenType["ListBlock"] = 3] = "ListBlock";
    TokenType[TokenType["Horizontal"] = 4] = "Horizontal";
    TokenType[TokenType["LinkDefinition"] = 5] = "LinkDefinition";
    TokenType[TokenType["CodeBlock"] = 6] = "CodeBlock";
    TokenType[TokenType["HTMLBlock"] = 7] = "HTMLBlock";
    TokenType[TokenType["HeaderBlock"] = 8] = "HeaderBlock";
    TokenType[TokenType["InlinePlain"] = 9] = "InlinePlain";
    TokenType[TokenType["Link"] = 10] = "Link";
    TokenType[TokenType["ImageLink"] = 11] = "ImageLink";
    TokenType[TokenType["Emphasis"] = 12] = "Emphasis";
    TokenType[TokenType["InlineCode"] = 13] = "InlineCode";
    TokenType[TokenType["MathBlock"] = 14] = "MathBlock";
    TokenType[TokenType["LatexBlock"] = 15] = "LatexBlock";
})(TokenType || (TokenType = {}));
exports.TokenType = TokenType;
// noinspection JSUnusedGlobalSymbols
const StdBlockTokenL = TokenType.Paragraph, StdBlockTokenR = TokenType.HeaderBlock + 1,
    StdInlineTokenL = TokenType.InlinePlain, StdInlineTokenR = TokenType.InlineCode + 1,
    StdBlockTokenCount = StdBlockTokenR - StdBlockTokenL, StdInlineTokenCount = StdInlineTokenR - StdInlineTokenL;
exports.StdBlockTokenCount = StdBlockTokenCount;
exports.StdInlineTokenCount = StdInlineTokenCount;
class NewLine {
    constructor(content) {
        this.token_type = TokenType.NewLine;
        this.content = content;
    }
}
exports.NewLine = NewLine;
/*
(.*\n{1...1})+

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines. (
A blank line is any line that looks like a blank line — a line containing nothing but spaces or
tabs is considered blank.) Normal paragraphs should not be indented with spaces or tabs.
*/
class Paragraph {
    constructor(inlineElements) {
        this.token_type = TokenType.Paragraph;
        this.inlineElements = inlineElements;
    }
}
exports.Paragraph = Paragraph;
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
class Quotes {
    constructor(tokens) {
        this.token_type = TokenType.Quotes;
        this.insideTokens = tokens;
    }
}
exports.Quotes = Quotes;
class ListElement {
    constructor(marker, innerBlocks = [], blankSeparated = false) {
        this.marker = marker;
        this.innerBlocks = innerBlocks;
        this.blankSeparated = blankSeparated;
    }
}
exports.ListElement = ListElement;
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
class ListBlock {
    constructor(ordered, listElements = []) {
        this.token_type = TokenType.ListBlock;
        this.listElements = listElements;
        this.ordered = ordered;
    }
    lookAhead(s) {
        if (this.ordered) {
            return ListBlock.lookAheadOrderedListNumber(s);
        } else {
            return ListBlock.lookAheadUnorderedListMarker(s);
        }
    }
    lookAhead0(s) {
        if (this.ordered) {
            return '0' <= s.source[0] && s.source[0] <= '9';
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
    static lookAheadOrderedListNumber(s) {
        for (let i = 0; ; i++) {
            if ('0' <= s.source[i] && s.source[i] <= '9') {
                continue;
            }
            if (s.source[i] == '.' && s.source[i + 1] == ' ') {
                let m = s.source.substr(0, i);
                s.forward(i + 2);
                return m;
            }
            return undefined;
        }
    }
    static lookAheadUnorderedListMarker(s) {
        if ('*+-'.includes(s.source[0]) && s.source[1] == ' ') {
            let m = s.source[0];
            s.forward(2);
            return m;
        }
        return undefined;
    }
}
exports.ListBlock = ListBlock;
class Horizontal {
    constructor() {
        this.token_type = TokenType.Horizontal;
    }
}
exports.Horizontal = Horizontal;
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
class LinkDefinition {
    constructor(linkIdentifier, url, title) {
        this.token_type = TokenType.LinkDefinition;
        this.linkIdentifier = linkIdentifier;
        this.url = url;
        this.title = title;
    }
}
exports.LinkDefinition = LinkDefinition;
/*
    (.*\n)+
    (.*\n)+
    ...

Within a code block, ampersands (&) and angle brackets (< and >) are automatically converted into
HTML entities. This makes it very easy to include example HTML source code using Markdown — just
paste it and indent it, and Markdown will handle the hassle of encoding the ampersands and angle
brackets.
*/
class CodeBlock {
    constructor(body, language) {
        this.token_type = TokenType.CodeBlock;
        this.body = body;
        this.language = language;
    }
}
exports.CodeBlock = CodeBlock;
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
class HTMLBlock {
    constructor(body) {
        this.token_type = TokenType.HTMLBlock;
        this.body = body;
    }
}
exports.HTMLBlock = HTMLBlock;
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
class HeaderBlock {
    constructor(inlineElements, level) {
        this.token_type = TokenType.HeaderBlock;
        this.inlineElements = inlineElements;
        this.level = level;
    }
}
exports.HeaderBlock = HeaderBlock;
class InlinePlain {
    constructor(content) {
        this.token_type = TokenType.InlinePlain;
        this.content = content;
    }
}
exports.InlinePlain = InlinePlain;
class Link {
    constructor(linkTitle, link, inline, title) {
        this.token_type = TokenType.Link;
        this.linkTitle = linkTitle;
        this.link = link;
        this.inlineOrReference = inline;
        this.title = title;
    }
}
exports.Link = Link;
class ImageLink {
    constructor(linkTitle, link, inline, title) {
        this.token_type = TokenType.ImageLink;
        this.linkTitle = linkTitle;
        this.link = link;
        this.inlineOrReference = inline;
        this.title = title;
    }
}
exports.ImageLink = ImageLink;
class Emphasis {
    constructor(content, level) {
        this.token_type = TokenType.Emphasis;
        this.content = content;
        this.level = level;
    }
}
exports.Emphasis = Emphasis;
class InlineCode {
    constructor(content) {
        this.token_type = TokenType.InlineCode;
        this.content = content;
    }
}
exports.InlineCode = InlineCode;
class LateXBlock {
    constructor(content) {
        this.token_type = TokenType.LatexBlock;
        this.content = content;
    }
}
exports.LateXBlock = LateXBlock;
class MathBlock {
    constructor(content, inline) {
        this.token_type = TokenType.MathBlock;
        this.content = content;
        this.inline = inline;
    }
}
exports.MathBlock = MathBlock;
