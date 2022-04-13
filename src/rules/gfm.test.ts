import {GFMFencedCodeBlockRule} from "./gfm";
import {elementMatcher, itWillMatchElement, itWillNotMatchElement, textAcceptor} from "../lib/util.test";
import {CodeBlock} from "../token/token";


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
