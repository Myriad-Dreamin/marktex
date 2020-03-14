import {
    CodeBlock,
    Emphasis,
    HeaderBlock,
    Horizontal,
    ImageLink,
    InlineCode,
    InlinePlain,
    Link,
    LinkDefinition,
    ListBlock,
    ListElement,
    MathBlock,
    NewLine,
    Paragraph,
    Quotes
} from "../token";
import {elementMatcher, expect, itWillMatchElement, itWillNotMatchElement, textAcceptor} from "../test_util";
import {
    CodeBlockRule,
    EmphasisRule,
    HeaderBlockRule,
    HorizontalRule,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    LinkDefinitionRule,
    LinkOrImageRule,
    ListBlockRule,
    QuotesRule
} from "./std";
import {ParagraphRule} from "./paragraph";
import {GFMFencedCodeBlockRule} from "./gfm";


describe('link/image regex', () => {
    let rule: LinkOrImageRule = new LinkOrImageRule();

    function itWillMatch(
        {text, imageMark, linkName, href, title}:
            { text: string, imageMark: string, linkName: string, href: string, title?: string }
    ) {
        it('will match ' + text, () => {
            let matchingGroup = rule.regex.exec(text);
            expect(matchingGroup).not.null;
            if (matchingGroup !== null) {
                expect(matchingGroup[1]).to.be.equal(imageMark);
                expect(matchingGroup[2]).to.be.equal(linkName);
                expect(matchingGroup[3]).to.be.equal(href);
                expect(matchingGroup[4]).to.be.equal(title);
            }
        })
    }


    itWillMatch({text: '![X](Y "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X   ](Y "Z")', imageMark: '!', linkName: 'X   ', href: 'Y', title: 'Z'});
    itWillMatch({text: '![   X   ](Y "Z")', imageMark: '!', linkName: '   X   ', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](Y     "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](  Y     "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](Y "Z"   )', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](<Y> "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](Y> "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](<Y "Z")', imageMark: '!', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![[]](Y "Z")', imageMark: '!', linkName: '[]', href: 'Y', title: 'Z'});
    itWillMatch({text: '[X](Y "Z")', imageMark: '', linkName: 'X', href: 'Y', title: 'Z'});
    itWillMatch({text: '[X]X](Y "Z")', imageMark: '', linkName: 'X]X', href: 'Y', title: 'Z'});
    itWillMatch({text: '[X[Q]X](Y "Z")', imageMark: '', linkName: 'X[Q]X', href: 'Y', title: 'Z'});
    itWillMatch({text: '![X](Y)', imageMark: '!', linkName: 'X', href: 'Y'});
    itWillMatch({text: '![](Y "Z")', imageMark: '!', linkName: '', href: 'Y', title: 'Z'});
    itWillMatch({text: '![](Y)', imageMark: '!', linkName: '', href: 'Y'});
});


describe("InlinePlainExceptSpecialMarksRule", () => {
    let rule: InlinePlainExceptSpecialMarksRule = new InlinePlainExceptSpecialMarksRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({text: "ggg", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg\n\n", matchedLength: "ggg\n\n".length, expectedElement: new InlinePlain("ggg\n\n")});
    match({text: "ggg\n\nggg", matchedLength: "ggg\n\nggg".length, expectedElement: new InlinePlain("ggg\n\nggg")});
    match({text: "   `", matchedLength: 3, expectedElement: new InlinePlain("   ")});
    match({text: "ggg<", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg[", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg*", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg_", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg`", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "铜", matchedLength: 1, expectedElement: new InlinePlain("铜")});
    notMatch({text: ""});
    notMatch({text: "<"});
    notMatch({text: "["});
    notMatch({text: "*"});
    notMatch({text: "_"});
    notMatch({text: "`"});
    match({text: "   \\`", matchedLength: 5, expectedElement: new InlinePlain("   \\`")});
    match({text: "ggg\\<", matchedLength: 5, expectedElement: new InlinePlain("ggg\\<")});
    match({text: "ggg\\[", matchedLength: 5, expectedElement: new InlinePlain("ggg\\[")});
    match({text: "ggg\\*", matchedLength: 5, expectedElement: new InlinePlain("ggg\\*")});
    match({text: "ggg\\_", matchedLength: 5, expectedElement: new InlinePlain("ggg\\_")});
    match({text: "ggg\\`", matchedLength: 5, expectedElement: new InlinePlain("ggg\\`")});

});

describe("InlinePlainRule", () => {
    let rule: InlinePlainRule = new InlinePlainRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({text: "ggg", matchedLength: "ggg".length, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg\n\n", matchedLength: "ggg\n\n".length, expectedElement: new InlinePlain("ggg\n\n")});
    match({text: "ggg\n\nggg", matchedLength: "ggg\n\nggg".length, expectedElement: new InlinePlain("ggg\n\nggg")});
    match({text: "   ", matchedLength: 3, expectedElement: new InlinePlain("   ")});
    match({text: "ggg<", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg[", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg*", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg_", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg`", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "铜", matchedLength: 1, expectedElement: new InlinePlain("铜")});
    notMatch({text: ""});
    match({text: "<", matchedLength: 1, expectedElement: new InlinePlain("<")});
    match({text: "[", matchedLength: 1, expectedElement: new InlinePlain("[")});
    match({text: "*", matchedLength: 1, expectedElement: new InlinePlain("*")});
    match({text: "_", matchedLength: 1, expectedElement: new InlinePlain("_")});
    match({text: "`", matchedLength: 1, expectedElement: new InlinePlain("`")});
});

describe("LinkOrImageRule", () => {
    let rule: InlinePlainRule = new LinkOrImageRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "[]()",
        matchedLength: "[]()".length,
        expectedElement: new Link("", "", true, undefined),
    });
    match({
        text: "[title](refer-link)",
        matchedLength: "[title](refer-link)".length,
        expectedElement: new Link("title", "refer-link", true, undefined),
    });
    match({
        text: "[title](refer-link 'option-title')",
        matchedLength: "[title](refer-link 'option-title')".length,
        expectedElement: new Link("title", "refer-link", true, 'option-title'),
    });
    match({
        text: '[title](refer-link "option-title")',
        matchedLength: '[title](refer-link "option-title")'.length,
        expectedElement: new Link("title", "refer-link", true, 'option-title'),
    });
    match({
        text: "[title](refer-link '')",
        matchedLength: "[title](refer-link '')".length,
        expectedElement: new Link("title", "refer-link", true, ''),
    });
    match({
        text: '[title](refer-link "")',
        matchedLength: '[title](refer-link "")'.length,
        expectedElement: new Link("title", "refer-link", true, ''),
    });
    match({
        text: '![title](refer-link "")',
        matchedLength: '![title](refer-link "")'.length,
        expectedElement: new ImageLink("title", "refer-link", true, ''),
    });
    match({
        text: "[title   ](refer-link)",
        matchedLength: "[title   ](refer-link)".length,
        expectedElement: new Link("title   ", "refer-link", true, undefined),
    });
    match({
        text: "[  title](refer-link)",
        matchedLength: "[  title](refer-link)".length,
        expectedElement: new Link("  title", "refer-link", true, undefined),
    });
    match({
        text: "[title](refer-link   )",
        matchedLength: "[title](refer-link   )".length,
        expectedElement: new Link("title", "refer-link", true, undefined),
    });
    match({
        text: "[t[i]tle](refer-link)",
        matchedLength: "[t[i]tle](refer-link)".length,
        expectedElement: new Link("t[i]tle", "refer-link", true, undefined),
    });
    match({
        text: "[t[]title](refer-link)",
        matchedLength: "[t[]title](refer-link)".length,
        expectedElement: new Link("t[]title", "refer-link", true, undefined),
    });
    match({
        text: "[t()title](refer-link)",
        matchedLength: "[t()title](refer-link)".length,
        expectedElement: new Link("t()title", "refer-link", true, undefined),
    });
    match({
        text: "[title](refer-(((link   )",
        matchedLength: "[title](refer-(((link   )".length,
        expectedElement: new Link("title", "refer-(((link", true, undefined),
    });
    match({
        text: "[title](refer-((()link   )",
        matchedLength: "[title](refer-((()".length,
        expectedElement: new Link("title", "refer-(((", true, undefined),
    });
});

describe("EmphasisRule", () => {
    let rule: EmphasisRule = new EmphasisRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "**_**",
        matchedLength: "**_**".length,
        expectedElement: new Emphasis("_", 2),
    });
    match({
        text: "*_**",
        matchedLength: "*_*".length,
        expectedElement: new Emphasis("_", 1),
    });
    notMatch({text: "**_*"});
    notMatch({text: "***_**"});
});

describe("InlineCodeRule", () => {
    let rule: InlineCodeRule = new InlineCodeRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "`dsf`",
        matchedLength: "`dsf`".length,
        expectedElement: new InlineCode("dsf"),
    });
    match({
        text: "`gg``",
        matchedLength: "`gg`".length,
        expectedElement: new InlineCode("gg"),
    });
    match({
        text: "``a`b``",
        matchedLength: "``a`b``".length,
        expectedElement: new InlineCode("a`b"),
    });
    match({
        text: "``a`b`c``",
        matchedLength: "``a`b`c``".length,
        expectedElement: new InlineCode("a`b`c"),
    });
    match({
        text: "``abc``d``",
        matchedLength: "``abc``".length,
        expectedElement: new InlineCode("abc"),
    });
    match({
        text: "``abc`a`d``",
        matchedLength: "``abc`a`d``".length,
        expectedElement: new InlineCode("abc`a`d"),
    });
    notMatch({text: "```"});
    notMatch({text: "```\n````"});
    notMatch({text: "````"});
    notMatch({text: "`````"});
    notMatch({text: "``````"});
});

describe("HorizontalRule", () => {
    let rule: HorizontalRule = new HorizontalRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "---",
        matchedLength: "---".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "-    --",
        matchedLength: "-    --".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "--------",
        matchedLength: "--------".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "--\t---    ---",
        matchedLength: "--\t---    ---".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "-    -\t---    ---",
        matchedLength: "-    -\t---    ---".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "-    -\t---    ---\n\n",
        matchedLength: "-    -\t---    ---\n".length,
        expectedElement: new Horizontal(),
    });
    match({
        text: "-    -\t-\n--    ---\n\n",
        matchedLength: "-    -\t-\n".length,
        expectedElement: new Horizontal(),
    });
    //todo: https://github.github.com/gfm/#example-17
    notMatch({text: " ---"});
    notMatch({text: "-*-"});
    notMatch({text: "-**"});
    notMatch({text: "-***"});
    notMatch({text: "-- - - -- - a"});
    notMatch({text: "a------"});
    notMatch({text: "---a---"});
});

describe("LinkDefinitionRule", () => {
    let rule: LinkDefinitionRule = new LinkDefinitionRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "[ ]: q",
        matchedLength: "[ ]: q".length,
        expectedElement: new LinkDefinition(" ", "q"),
    });
    match({
        text: '[foo]: http://example.com/  "Optional Title Here"',
        matchedLength: '[foo]: http://example.com/  "Optional Title Here"'.length,
        expectedElement: new LinkDefinition("foo", "http://example.com/", 'Optional Title Here'),
    });
    match({
        text: "[foo]: http://example.com/  'Optional Title Here'",
        matchedLength: "[foo]: http://example.com/  'Optional Title Here'".length,
        expectedElement: new LinkDefinition("foo", "http://example.com/", 'Optional Title Here'),
    });
    match({
        text: "[foo]: http://example.com/  (Optional Title Here)",
        matchedLength: "[foo]: http://example.com/  (Optional Title Here)".length,
        expectedElement: new LinkDefinition("foo", "http://example.com/", 'Optional Title Here'),
    });
    notMatch({text: "[]: q"});
    notMatch({text: "[q]: "});
    // notMatch({text: "[q]: ''"});
    match({
        text: "[q]: ''",
        matchedLength: "[q]: ''".length,
        expectedElement: new LinkDefinition("q", "''", undefined),
    });
});

describe("ParagraphRule", () => {
    let rule: ParagraphRule = new ParagraphRule({skipLaTeXBlock: true, skipMathBlock: true});
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "a",
        matchedLength: "a".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a")],
        ),
    });
    match({
        text: "www**b**x__qwq__*233*",
        matchedLength: "www**b**x__qwq__*233*".length,
        expectedElement: new Paragraph(
            [
                new InlinePlain("www"),
                new Emphasis("b", 2),
                new InlinePlain("x"),
                new Emphasis("qwq", 2),
                new Emphasis("233", 1),
            ],
        ),
    });
    match({
        text: "a\n\nqwq",
        matchedLength: "a".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a")],
        ),
    });
    match({
        text: "a\\inlineLatexRule\n\nqwq",
        matchedLength: "a\\inlineLatexRule".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a\\inlineLatexRule")],
        ),
    });
    match({
        text: "a\\inlineLatexRule{}{}\n\nqwq",
        matchedLength: "a\\inlineLatexRule{}{}".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a\\inlineLatexRule{}{}")],
        ),
    });
    match({
        text: "a\n\\blockLatexRule\n\nqwq",
        matchedLength: "a".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a")],
        ),
    });
    match({
        text: '$A[1...n]=[A[1]...A[n]](n>=1)$总是表示一个数组,$len[A]=n$总是表示一个数组的长度.\n' +
            '\\subsubsection{数组切片}\n',
        matchedLength: '$A[1...n]=[A[1]...A[n]](n>=1)$总是表示一个数组,$len[A]=n$总是表示一个数组的长度.'.length,
        expectedElement: new Paragraph(
            [
                new MathBlock("A[1...n]=[A[1]...A[n]](n>=1)", true),
                new InlinePlain("总是表示一个数组,"),
                new MathBlock("len[A]=n", true),
                new InlinePlain("总是表示一个数组的长度."),
            ],
        ),
    });


    match({
        text: "a\nqwq",
        matchedLength: "a\nqwq".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a\nqwq")],
        ),
    });
    notMatch({text: "\n"});
    notMatch({text: "\ntest"});
    notMatch({text: "\n\ntest"});
});

describe("CodeBlockRule", () => {
    let rule: CodeBlockRule = new CodeBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "\tqwq",
        matchedLength: "\tqwq".length,
        expectedElement: new CodeBlock("qwq"),
    });
    match({
        text: "    qwq",
        matchedLength: "    qwq".length,
        expectedElement: new CodeBlock("qwq"),
    });
    match({
        text: "     qwq",
        matchedLength: "     qwq".length,
        expectedElement: new CodeBlock(" qwq"),
    });
    match({
        text: "\tqwq\tqwq",
        matchedLength: "\tqwq\tqwq".length,
        expectedElement: new CodeBlock("qwq\tqwq"),
    });
    match({
        text: "\tqwq\t\nqwq",
        matchedLength: "\tqwq\t\n".length,
        expectedElement: new CodeBlock("qwq\t\n"),
    });
    match({
        text: "\tqwq\t\n\tqwq",
        matchedLength: "\tqwq\t\n\tqwq".length,
        expectedElement: new CodeBlock("qwq\t\nqwq"),
    });
    match({
        text: "\tqwq\t\nqwq\n\tqwq",
        matchedLength: "\tqwq\t\n".length,
        expectedElement: new CodeBlock("qwq\t\n"),
    });
    notMatch({text: "\n"});
});

describe("GFMFencedCodeBlockRule", () => {
    let rule: GFMFencedCodeBlockRule = new GFMFencedCodeBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        title: 'https://github.github.com/gfm/#example-89',
        text: "```\n" +
            "<\n" +
            " >\n" +
            "```",
        matchedLength: ("```\n" +
            "<\n" +
            " >\n" +
            "```").length,
        expectedElement: new CodeBlock("<\n >\n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-90',
        text: "~~~\n" +
            "<\n" +
            " >\n" +
            "~~~",
        matchedLength: ("~~~\n" +
            "<\n" +
            " >\n" +
            "~~~").length,
        expectedElement: new CodeBlock("<\n >\n"),
    });
    notMatch({
        title: 'https://github.github.com/gfm/#example-91',
        text: "``\n" +
            "foo\n" +
            "``",
    });
    match({
        title: 'https://github.github.com/gfm/#example-92',
        text: "```\n" +
            "aaa\n" +
            "~~~\n" +
            "```",
        matchedLength: ("```\n" +
            "aaa\n" +
            "~~~\n" +
            "```").length,
        expectedElement: new CodeBlock("aaa\n~~~\n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-93',
        text: "~~~\n" +
            "aaa\n" +
            "```\n" +
            "~~~",
        matchedLength: ("~~~\n" +
            "aaa\n" +
            "~~~\n" +
            "~~~").length,
        expectedElement: new CodeBlock("aaa\n```\n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-94',
        text: "````\n" +
            "aaa\n" +
            "```\n" +
            "``````",
        matchedLength: ("````\n" +
            "aaa\n" +
            "```\n" +
            "``````").length,
        expectedElement: new CodeBlock("aaa\n```\n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-95',
        text: "~~~~\n" +
            "aaa\n" +
            "~~~\n" +
            "~~~~",
        matchedLength: ("~~~~\n" +
            "aaa\n" +
            "~~~\n" +
            "~~~~").length,
        expectedElement: new CodeBlock("aaa\n~~~\n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-96',
        text: "```\n",
        matchedLength: ("```\n").length,
        expectedElement: new CodeBlock(""),
    });
    match({
        title: 'https://github.github.com/gfm/#example-97',
        text: "`````\n" +
            "\n" +
            "```\n" +
            "aaa",
        matchedLength: ("`````\n" +
            "\n" +
            "```\n" +
            "aaa").length,
        expectedElement: new CodeBlock("\n```\naaa"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-99',
        text: "```\n" +
            "\n" +
            "  \n" +
            "```",
        matchedLength: ("```\n" +
            "\n" +
            "  \n" +
            "```").length,
        expectedElement: new CodeBlock("\n  \n"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-100',
        text: "```\n" +
            "```",
        matchedLength: ("```\n" +
            "```").length,
        expectedElement: new CodeBlock(""),
    });
    match({
        title: 'https://github.github.com/gfm/#example-108',
        text: "~~~~~~\n" +
            "aaa\n" +
            "~~~ ~~",
        matchedLength: ("~~~~~~\n" +
            "aaa\n" +
            "~~~ ~~").length,
        expectedElement: new CodeBlock("aaa\n" +
            "~~~ ~~"),
    });
    notMatch({
        title: 'https://github.github.com/gfm/#example-109',
        text: "``` ```\n" +
            "aaa",
    });
    match({
        title: 'https://github.github.com/gfm/#example-112',
        text: "```ruby\n" +
            "def foo(x)\n" +
            "  return 3\n" +
            "end\n" +
            "```",
        matchedLength: ("```ruby\n" +
            "def foo(x)\n" +
            "  return 3\n" +
            "end\n" +
            "```").length,
        expectedElement: new CodeBlock("def foo(x)\n" +
            "  return 3\n" +
            "end\n", "ruby"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-113',
        text: "~~~~    ruby startline=3 $%@#$\n" +
            "def foo(x)\n" +
            "  return 3\n" +
            "end\n" +
            "~~~~~~~",
        matchedLength: ("~~~~    ruby startline=3 $%@#$\n" +
            "def foo(x)\n" +
            "  return 3\n" +
            "end\n" +
            "~~~~~~~").length,
        expectedElement: new CodeBlock("def foo(x)\n" +
            "  return 3\n" +
            "end\n", "ruby"),
    });
    match({
        title: 'https://github.github.com/gfm/#example-114',
        text: "````;\n" +
            "````",
        matchedLength: ("````;\n" +
            "````").length,
        expectedElement: new CodeBlock("", ";"),
    });
    notMatch({
        title: 'https://github.github.com/gfm/#example-115',
        text: "``` aa ```\n" +
            "foo",
    });
    match({
        title: 'https://github.github.com/gfm/#example-116',
        text: "~~~ aa ``` ~~~\n" +
            "foo\n" +
            "~~~",
        matchedLength: ("~~~ aa ``` ~~~\n" +
            "foo\n" +
            "~~~").length,
        expectedElement: new CodeBlock("foo\n", "aa"),
    });
    // ??? https://github.github.com/gfm/#example-117
});

describe("HeaderBlockRule", () => {
    let rule: HeaderBlockRule = new HeaderBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "# qwq",
        matchedLength: "# qwq".length,
        expectedElement: new HeaderBlock([new InlinePlain("qwq")], 1),
    });
    match({
        text: "### qwq",
        matchedLength: "### qwq".length,
        expectedElement: new HeaderBlock([new InlinePlain("qwq")], 3),
    });
    match({
        text: "q\n=",
        matchedLength: "q\n=".length,
        expectedElement: new HeaderBlock([new InlinePlain("q")], 1),
    });
    match({
        text: "qwq\n=",
        matchedLength: "qwq\n=".length,
        expectedElement: new HeaderBlock([new InlinePlain("qwq")], 1),
    });
    notMatch({text: "\n"});
    notMatch({text: "qwq\n"});
    notMatch({text: "\n===="});
    notMatch({text: "####### qwq"});
});

describe("QuotesRule", () => {
    let rule: QuotesRule = new QuotesRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "> ",
        matchedLength: "> ".length,
        expectedElement: new Quotes([]),
    });
    match({
        text: "> \n",
        matchedLength: "> \n".length,
        expectedElement: new Quotes([new NewLine("\n")]),
    });
    match({
        text: "> a\n",
        matchedLength: "> a\n".length,
        expectedElement: new Quotes([new Paragraph([new InlinePlain("a\n")])]),
    });
    match({
        text: "> a\n> a\n",
        matchedLength: "> a\n> a\n".length,
        expectedElement: new Quotes([new Paragraph([new InlinePlain("a\na\n")])]),
    });
    match({
        text: "> a\n\n> a\n",
        matchedLength: "> a\n".length,
        expectedElement: new Quotes([new Paragraph([new InlinePlain("a\n")])]),
    });
    match({
        text: "> a\nqwq\n> a\n",
        matchedLength: "> a\nqwq\n> a\n".length,
        expectedElement: new Quotes([new Paragraph([new InlinePlain("a\nqwq\na\n")])]),
    });
    match({
        text: "> a\nqwq\n>\n> a\n",
        matchedLength: "> a\nqwq\n>\n> a\n".length,
        expectedElement: new Quotes([
            new Paragraph([new InlinePlain("a\nqwq")]),
            new NewLine('\n\n'),
            new Paragraph([new InlinePlain("a\n")])
        ]),
    });
    notMatch({text: "\n"});

//    todo: https://github.github.com/gfm/#example-98
});

describe("ListBlockRule", () => {
    let rule: ListBlockRule = new ListBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "* ",
        matchedLength: "* ".length,
        expectedElement: new ListBlock(false, [new ListElement('*')]),
    });
    match({
        text: "* a",
        matchedLength: "* a".length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('a')])]
            )]),
    });
    match({
        text: "* a\n* b",
        matchedLength: "* a\n* b".length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('a\n')])]
            ),
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('b')])]
            ),
        ]),
    });
    match({
        text: "* a\n\n* b",
        matchedLength: "* a\n\n* b".length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('a\n')])],
                true,
            ),
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('b')])],
                true,
            ),
        ]),
    });
});

describe("HTMLBlockRule", () => {
    // let rule: HTMLBlockRule = new HTMLBlockRule();
    // let match: elementMatcher = itWillMatchElement(rule);
    // let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

});