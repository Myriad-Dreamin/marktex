import * as chai from 'chai';
import {
    blockRules,
    CodeBlockRule,
    EmphasisRule,
    HeaderBlockRule,
    HorizontalRule,
    HTMLBlockRule,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    inlineRules,
    LinkDefinitionRule,
    LinkOrImageRule,
    ListBlockRule,
    ParagraphRule,
    QuotesRule,
    Rule,
    RuleContext,
    validTags
} from "./rules";
import {Lexer} from "./lexer";
import {StringStream} from "./source";
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
    Paragraph
} from "./token";

const expect = chai.expect;


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


type elementMatcher = ({text, matchedLength: number, expectedElement}: { text: string, matchedLength: number, expectedElement: any }) => void;
type elementNotMatcher = ({text}: { text: string }) => void;


function createContext(): RuleContext {
    return new Lexer({inlineRules, blockRules}, {validTags});
}

function itWillMatchElement(rule: Rule, ctx: RuleContext = createContext()): elementMatcher {
    return ({text, matchedLength, expectedElement}: { text: string, matchedLength: number, expectedElement: any }) => {
        it('will match ' + text, () => {
            let stream = new StringStream(text);
            expect(rule.match(stream, ctx)).to.deep.equal(expectedElement);
            expect(stream.pos).to.equal(matchedLength);
        })
    }
}

function itWillNotMatchElement(rule: Rule, ctx: RuleContext = createContext()): elementNotMatcher {
    return ({text}: { text: string }) => {
        it('will not match ' + text, () => {
            expect(rule.match(new StringStream(text), ctx)).to.undefined;
        })
    }
}

describe("InlinePlainExceptSpecialMarksRule", () => {
    let rule: InlinePlainExceptSpecialMarksRule = new InlinePlainExceptSpecialMarksRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

    match({text: "ggg", matchedLength: "ggg".length, expectedElement: new InlinePlain("ggg")});
    match({text: "ggg\n\n", matchedLength: "ggg\n\n".length, expectedElement: new InlinePlain("ggg\n\n")});
    match({text: "ggg\n\nggg", matchedLength: "ggg\n\nggg".length, expectedElement: new InlinePlain("ggg\n\nggg")});
    match({text: "   `", matchedLength: 4, expectedElement: new InlinePlain("   `")});
    match({text: "ggg<", matchedLength: 4, expectedElement: new InlinePlain("ggg<")});
    match({text: "ggg[", matchedLength: 4, expectedElement: new InlinePlain("ggg[")});
    match({text: "ggg*", matchedLength: 4, expectedElement: new InlinePlain("ggg*")});
    match({text: "ggg_", matchedLength: 4, expectedElement: new InlinePlain("ggg_")});
    match({text: "ggg`", matchedLength: 4, expectedElement: new InlinePlain("ggg`")});
    match({text: "铜`", matchedLength: 2, expectedElement: new InlinePlain("铜`")});
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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
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
    notMatch({text: " ---"});
    notMatch({text: "-*-"});
    notMatch({text: "-**"});
    notMatch({text: "-***"});
});

describe("LinkDefinitionRule", () => {
    let rule: LinkDefinitionRule = new LinkDefinitionRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
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
    let rule: ParagraphRule = new ParagraphRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
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
        matchedLength: "a\n\n".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a\n\n")],
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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
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
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
    match({
        text: "# qwq",
        matchedLength: "# qwq".length,
        expectedElement: new HeaderBlock("qwq", 1),
    });
    match({
        text: "### qwq",
        matchedLength: "### qwq".length,
        expectedElement: new HeaderBlock("qwq", 3),
    });
    match({
        text: "q\n=",
        matchedLength: "q\n=".length,
        expectedElement: new HeaderBlock("q", 1),
    });
    match({
        text: "qwq\n=",
        matchedLength: "qwq\n=".length,
        expectedElement: new HeaderBlock("qwq", 1),
    });
    notMatch({text: "\n"});
    notMatch({text: "qwq\n"});
    notMatch({text: "\n===="});
    notMatch({text: "####### qwq"});
});

describe("QuotesRule", () => {
    let rule: QuotesRule = new QuotesRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
});

describe("ListBlockRule", () => {
    let rule: ListBlockRule = new ListBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
});

describe("HTMLBlockRule", () => {
    let rule: HTMLBlockRule = new HTMLBlockRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);
});