import {CodeBlockRule, HeaderBlockRule, HorizontalRule, ListBlockRule, QuotesRule} from "./std";
import {elementMatcher, itWillMatchElement} from "../lib/test_util";
import {
    CodeBlock,
    HeaderBlock,
    Horizontal,
    InlinePlain,
    ListBlock,
    ListElement,
    NewLine,
    Paragraph,
    Quotes
} from "../token/token";
import {Rule} from "./rule";

describe('gfm spec (2.2 Tabs) 1~11', () => {
    /**
     * alert!: different from gfm/commonMark: \t is not considered as [    ]
     */

    let rule: Rule;
    let match: elementMatcher;

    rule = new CodeBlockRule();
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-1
    match({
        text: '\tfoo\tbaz\t\tbim',
        matchedLength: '\tfoo\tbaz\t\tbim'.length,
        expectedElement: new CodeBlock("foo\tbaz\t\tbim"),
    });

    // https://github.github.com/gfm/#example-2
    match({
        text: '  \tfoo\tbaz\t\tbim',
        matchedLength: '  \tfoo\tbaz\t\tbim'.length,
        expectedElement: new CodeBlock("foo\tbaz\t\tbim"),
    });

    // https://github.github.com/gfm/#example-3
    match({
        text: '    a→a\n' +
            '    ὐ→a',
        matchedLength: ('    a→a\n' +
            '    ὐ→a').length,
        expectedElement: new CodeBlock("a→a\n" +
            "ὐ→a"),
    });

    rule = new ListBlockRule({enableGFMRules: true});
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-4
    match({
        text: '  - foo\n\n\tbar',
        matchedLength: '  - foo\n\n\tbar'.length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '-',
                [
                    new Paragraph([new InlinePlain('foo')]),
                    new NewLine('\n\n'),
                    new Paragraph([new InlinePlain('bar')]),
                ],
                false,
            ),
        ]),
    });

    // https://github.github.com/gfm/#example-5, todo: why 2 space in code block
    match({
        text: '- foo\n\n\t\tbar',
        matchedLength: '- foo\n\n\t\tbar'.length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '-',
                [
                    new Paragraph([new InlinePlain('foo')]),
                    new NewLine('\n\n'),
                    new CodeBlock('bar'),
                ],
                false,
            ),
        ]),
    });

    rule = new QuotesRule();
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-6
    match({
        text: '>\t\tfoo',
        matchedLength: '-\t\tfoo'.length,
        expectedElement: new Quotes([
            new CodeBlock('foo'),
        ]),
    });

    rule = new ListBlockRule({enableGFMRules: true});
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-7
    match({
        text: '-\t\tfoo',
        matchedLength: '-\t\tfoo'.length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '-',
                [
                    new CodeBlock('foo'),
                ],
                false,
            ),
        ]),
    });

    // https://github.github.com/gfm/#example-9
    match({
        text: ' - foo\n   - bar\n\t - baz',
        matchedLength: ' - foo\n   - bar\n\t - baz'.length,
        expectedElement: new ListBlock(false, [
            new ListElement(
                '-',
                [
                    new Paragraph([new InlinePlain('foo')]),
                    new NewLine('\n'),
                    new ListBlock(false, [
                        new ListElement(
                            '-',
                            [
                                new Paragraph([new InlinePlain('bar')]),
                                new NewLine('\n'),
                            ],
                            false,
                        ),
                        new ListElement(
                            '-',
                            [
                                new Paragraph([new InlinePlain('baz')]),
                            ],
                            false,
                        ),
                    ]),
                ],
                false,
            ),
        ]),
    });

    rule = new CodeBlockRule();
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-8
    match({
        text: '    foo\n\tbaz',
        matchedLength: '    foo\n\tbaz'.length,
        expectedElement: new CodeBlock('foo\nbaz'),
    });

    rule = new HeaderBlockRule();
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-10
    match({
        text: '#\tFoo',
        matchedLength: '#\tFoo'.length,
        expectedElement: new HeaderBlock([new InlinePlain('Foo')], 1),
    });

    rule = new HorizontalRule();
    match = itWillMatchElement(rule);

    // https://github.github.com/gfm/#example-11
    match({
        text: '*\t*\t*\t',
        matchedLength: '*\t*\t*\t'.length,
        expectedElement: new Horizontal(),
    });

})



