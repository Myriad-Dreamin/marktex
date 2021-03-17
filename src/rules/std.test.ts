import {
    CodeBlockRule,
    EmphasisRule,
    HeaderBlockRule,
    HorizontalRule,
    HTMLBlockRule,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    LinkDefinitionRule,
    LinkOrImageRule,
    ListBlockRule,
    QuotesRule
} from "./std";
import {elementMatcher, expect, itWillMatchElement, itWillNotMatchElement, textAcceptor} from "../lib/test_util";
import {
    CodeBlock,
    Emphasis,
    HeaderBlock,
    Horizontal,
    HTMLBlock,
    ImageLink,
    InlineCode,
    InlinePlain,
    Link,
    LinkDefinition,
    ListBlock,
    ListElement,
    NewLine,
    Paragraph,
    Quotes
} from "../token/token";

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
    match({text: "   \\`", matchedLength: 5, expectedElement: new InlinePlain("   `")});
    match({text: "ggg\\<", matchedLength: 3, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg\\[", matchedLength: 5, expectedElement: new InlinePlain("ggg[")});
    match({text: "ggg\\*", matchedLength: 5, expectedElement: new InlinePlain("ggg*")});
    match({text: "ggg\\_", matchedLength: 5, expectedElement: new InlinePlain("ggg_")});
    match({text: "ggg\\`", matchedLength: 5, expectedElement: new InlinePlain("ggg`")});

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
        text: "<MAILTO:afaasd@a.com>",
        matchedLength: "<MAILTO:afaasd@a.com>".length,
        expectedElement: new Link("afaasd@a.com", "mailto:afaasd@a.com", true, undefined),
    });
    match({
        text: "<ab:>",
        matchedLength: "<ab:>".length,
        expectedElement: new Link("ab:", "ab:", true, undefined),
    });
    match({
        text: "<http://foo.bar.baz>",
        matchedLength: "<http://foo.bar.baz>".length,
        expectedElement: new Link("http://foo.bar.baz", "http://foo.bar.baz", true, undefined),
    });
    match({
        text: "<irc://foo.bar:2233/baz>",
        matchedLength: "<irc://foo.bar:2233/baz>".length,
        expectedElement: new Link("irc://foo.bar:2233/baz", "irc://foo.bar:2233/baz", true, undefined),
    });
    match({
        text: "<affffffffffffffffffffff:>",
        matchedLength: "<affffffffffffffffffffff:>".length,
        expectedElement: new Link("affffffffffffffffffffff:", "affffffffffffffffffffff:", true, undefined),
    });
    notMatch({text: "<a:bad-link>"});
    notMatch({text: "<:bad-link>"});
    notMatch({text: "<bad-link>"});
    notMatch({text: "<a:bad-linf>"});
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
    let rule: ListBlockRule = new ListBlockRule({});
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "* ",
        matchedLength: "* ".length,
        expectedElement: new ListBlock(false, [new ListElement('*')]),
    });
    
    match({
        text: "* 1\n1\n\n    + 1\n+ 1",
        matchedLength: "* 1\n1\n\n    + 1\n+ 1".length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '*',
                [
                    new Paragraph([new InlinePlain('1')]),
                    new NewLine('\n'),
                    new Paragraph([new InlinePlain('1')]),
                    new NewLine('\n\n'),
                    new ListBlock(false, [
                        new ListElement(
                            '+',
                            [
                                new Paragraph([new InlinePlain('1')]),
                                new NewLine('\n'),
                            ],
                            false,
                        ),
                    ]),
                ],

                false,
            ),
            new ListElement(
                '+',
                [new Paragraph([new InlinePlain('1')])],
                false,
            ),
        ]),
    });

    match({
        text: "* a\n\n* b",
        matchedLength: "* a\n\n* b".length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '*',
                [
                    new Paragraph([new InlinePlain('a')]),
                    new NewLine('\n'),
                ],
                true,
            ),
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('b')])],
                false,
            ),
        ]),
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
                [
                    new Paragraph([new InlinePlain('a')]),
                    new NewLine('\n'),
                ]
            ),
            new ListElement(
                '*',
                [new Paragraph([new InlinePlain('b')])]
            ),
        ]),
    });

    match({
        text:
            "1. weak isolation between TAs in the TEE, with\n" +
            "2. Trusted Computing Base (TCB) expansion, and\n" +
            "3. highly privileged access to the platform, making TrustZone a high-value target for attackers.\n" +
            "\n" +
            "Spatial isolation of a SANCTUARY Instance is achieved by\n",
        matchedLength: (
            "1. weak isolation between TAs in the TEE, with\n" +
            "2. Trusted Computing Base (TCB) expansion, and\n" +
            "3. highly privileged access to the platform, making TrustZone a high-value target for attackers.\n" +
            "\n")
                .length,
        expectedElement: new ListBlock(true, [
            new ListElement(
                '1',
                [
                    new Paragraph([new InlinePlain('weak isolation between TAs in the TEE, with')]),
                    new NewLine('\n'),
                ]
            ),
            new ListElement(
                '2',
                [
                    new Paragraph([new InlinePlain('Trusted Computing Base (TCB) expansion, and')]),
                    new NewLine('\n'),
                ]
            ),
            new ListElement(
                '3',
                [
                    new Paragraph([new InlinePlain('highly privileged access to the platform, making TrustZone a high-value target for attackers.')]),
                    new NewLine('\n'),
                ],
                true,
            ),
        ])
    })
});

describe("GFMListBlockRule", () => {
    let rule: ListBlockRule = new ListBlockRule({enableGFMRules: true});
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);

    match({
        text: "* [ ]",
        matchedLength: "* [ ]".length,
        expectedElement: new ListBlock(false,
            [new ListElement('*',
                [new Paragraph([new InlinePlain('[ ]')])])]),
    });

    match({
        text: "* [ ] a",
        matchedLength: "* [ ] a".length,
        expectedElement: new ListBlock(false,
            [new ListElement('*',
                [new Paragraph([new InlinePlain('a')])], false, ' ')]),
    });
});

describe("HTMLBlockRule", () => {
    let rule: HTMLBlockRule = new HTMLBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: textAcceptor = itWillNotMatchElement(rule);
    match({
        text: "<a/>",
        matchedLength: "<a/>".length,
        expectedElement: new HTMLBlock("<a/>"),
    });
    match({
        text: "<a/>\n",
        matchedLength: "<a/>".length,
        expectedElement: new HTMLBlock("<a/>"),
    });
    match({
        text: "<a>",
        matchedLength: "<a>".length,
        expectedElement: new HTMLBlock("<a>"),
    });
    match({
        text: "<a>\n",
        matchedLength: "<a>\n".length,
        expectedElement: new HTMLBlock("<a>\n"),
    });
    match({
        text: "<a>\nb",
        matchedLength: "<a>\nb".length,
        expectedElement: new HTMLBlock("<a>\nb"),
    });
    match({
        text: "<a>\nb\n\nc",
        matchedLength: "<a>\nb".length,
        expectedElement: new HTMLBlock("<a>\nb"),
    });
    match({
        text: "<a>\n\n",
        matchedLength: "<a>".length,
        expectedElement: new HTMLBlock("<a>"),
    });


//<agq/>
// <agq gg/>
// <agq gg  gg/>
// <agq gg= gg/>
// <ag gg="" g/>
// <bb g='' g/>
// <a
// >
// <a>
// <bab>
// <c2c>
// <a/>
// <b2/>
// <a  />
// <b2
// data="foo" >
// <a foo="bar" bam = 'baz <em>"</em>'
// _boolean zoop:33=zoop:33 />
// <responsive-image src="foo.jpg" />
//
// <33>
// <__>
// <a h*#ref="hi">
// <a href="hi'>
// <a href=hi'>
// < a>
// <
// foo>
// <bar/ >
// <foo bar=baz
// bim!bop />
// <a href='bar'title=title>
// <>
// 如果a1
// <a2>a3

//    </qwqw   >
// </ qwqw   >
// </ qwq ="">
// </qwq ="asdf">
// </a_adf gg>
// </a_adf>
});
