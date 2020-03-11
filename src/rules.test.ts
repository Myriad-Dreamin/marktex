import * as chai from 'chai';
import {
    blockRules,
    EmphasisRule,
    InlineCodeRule,
    InlinePlainExceptSpecialMarksRule,
    InlinePlainRule,
    inlineRules,
    LinkOrImageRule,
    Rule,
    RuleContext,
    validTags
} from "./rules";
import {Lexer} from "./lexer";
import {StringStream} from "./source";
import {ImageLink, InlinePlain, Link} from "./token";

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

    //todo
});

describe("InlineCodeRule", () => {
    let rule: InlineCodeRule = new InlineCodeRule();
    let match: elementMatcher = itWillMatchElement(rule);
    let notMatch: elementNotMatcher = itWillNotMatchElement(rule);

    //todo
//`gg``
//
// `dsf`
//
// ```
//
// ````
//
// ``a`b``
//
//
// ``a`b`c``
//
//
// ``abc``d``
// ``abc`a`d``

});