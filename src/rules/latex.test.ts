import {ParagraphRule} from "./std";
import {elementMatcher, itWillMatchElement, itWillNotMatchElement, textAcceptor} from "../lib/util.test";
import {Emphasis, InlinePlain, MathBlock, Paragraph} from "../token/token";

describe("ParagraphRule", () => {
    let rule: ParagraphRule = new ParagraphRule();
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
        matchedLength: "a".length,
        expectedElement: new Paragraph(
            [new InlinePlain("a")],
        ),
    });
    notMatch({text: "\n"});
    notMatch({text: "\ntest"});
    notMatch({text: "\n\ntest"});
});
