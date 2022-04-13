import {CodeBlockRule, HeaderBlockRule, HorizontalRule, ListBlockRule, QuotesRule} from "./std";
import {elementMatcher, itWillMatchElement, itWillNotMatchElement, textAcceptor} from '../lib/util.test';
import {
    CodeBlock, Emphasis,
    HeaderBlock,
    Horizontal, InlineCode,
    InlinePlain,
    ListBlock,
    ListElement,
    NewLine,
    Paragraph,
    Quotes, StrikeThrough, TableBlock
} from '../token/token';
import {Rule} from "./rule";
import {GFMStrikeThroughRule, GFMTableBlockRule} from './gfm';

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

});

// 2.3 Insecure characters todo
// For security reasons, the Unicode character U+0000 must be replaced with the REPLACEMENT CHARACTER (U+FFFD).


describe('gfm spec 4.10Tables (extension)', () => {
    let rule: Rule;
    let match: elementMatcher;
    let notMatch: textAcceptor;

    rule = new GFMTableBlockRule();
    match = itWillMatchElement(rule);
    notMatch = itWillNotMatchElement(rule);

    // https://github.github.com/gfm/#example-198
    match({
        text: '| foo | bar |\n| --- | --- |\n| baz | bim |',
        matchedLength: '| foo | bar |\n| --- | --- |\n| baz | bim |'.length,
        expectedElement: new TableBlock([[new InlinePlain(" foo ")], [new InlinePlain(" bar ")], ], [0, 0], [
            [[new InlinePlain(" baz ")], [new InlinePlain(" bim ")]],
        ]),
    });

    // https://github.github.com/gfm/#example-199
    match({
        text: '| abc | defghi |\n' +
            ':-: | -----------:\n' +
            'bar | baz',
        matchedLength: ('| abc | defghi |\n' +
            ':-: | -----------:\n' +
            'bar | baz').length,
        expectedElement: new TableBlock([[new InlinePlain(" abc ")], [new InlinePlain(" defghi ")], ], [3, 1], [
            [[new InlinePlain("bar ")], [new InlinePlain(" baz")]],
        ]),
    });

    // https://github.github.com/gfm/#example-200
    match({
        text: '| f\\|oo  |\n' +
            '| ------ |\n' +
            '| b `\\|` az |\n' +
            '| b **\\|** im |',
        matchedLength: ('| f\\|oo  |\n' +
            '| ------ |\n' +
            '| b `\\|` az |\n' +
            '| b **\\|** im |').length,
        expectedElement: new TableBlock([[new InlinePlain(" f|oo  ")]], [0], [
            [[new InlinePlain(" b "), new InlineCode("|"), new InlinePlain(" az ")]],
            [[new InlinePlain(" b "), new Emphasis("|", 2), new InlinePlain(" im ")]],
        ]),
    });

    // https://github.github.com/gfm/#example-201
    match({
        text: '| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar | baz |\n' +
            '> bar',
        matchedLength: ('| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar | baz |\n').length,
        expectedElement: new TableBlock([[new InlinePlain(" abc ")], [new InlinePlain(" def ")], ], [0, 0], [
            [[new InlinePlain(" bar ")], [new InlinePlain(" baz ")]],
        ]),
    });

    // https://github.github.com/gfm/#example-202
    match({
        text: '| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar | baz |\n' +
            'bar\n' +
            '\n' +
            'bar\n',
        matchedLength: ('| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar | baz |\n').length,
        expectedElement: new TableBlock([[new InlinePlain(" abc ")], [new InlinePlain(" def ")], ], [0, 0], [
            [[new InlinePlain(" bar ")], [new InlinePlain(" baz ")]],
        ]),
    });

    // https://github.github.com/gfm/#example-203
    notMatch({
        text: '| abc | def |\n' +
            '| --- |\n' +
            '| bar |',
    });

    // https://github.github.com/gfm/#example-204
    match({
        text: '| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar |\n' +
            '| bar | baz | boo |',
        matchedLength: ('| abc | def |\n' +
            '| --- | --- |\n' +
            '| bar |\n' +
            '| bar | baz | boo |').length,
        expectedElement: new TableBlock([[new InlinePlain(" abc ")], [new InlinePlain(" def ")], ], [0, 0], [
            [[new InlinePlain(" bar ")], []],
            [[new InlinePlain(" bar ")], [new InlinePlain(" baz ")]],
        ]),
    });

    // https://github.github.com/gfm/#example-205
    match({
        text: '| abc | def |\n' +
            '| --- | --- |\n',
        matchedLength: ('| abc | def |\n' +
            '| --- | --- |\n').length,
        expectedElement: new TableBlock([[new InlinePlain(" abc ")], [new InlinePlain(" def ")], ], [0, 0], [
        ]),
    });
});

describe('gfm spec 6.5 Strikethrough (extension)\n', () => {
    let rule: Rule;
    let match: elementMatcher;
    let notMatch: textAcceptor;

    rule = new GFMStrikeThroughRule();
    match = itWillMatchElement(rule);
    notMatch = itWillNotMatchElement(rule);

    // https://github.github.com/gfm/#example-491
    match({
        text: '~~Hi~~ Hello, world!',
        matchedLength: '~~Hi~~'.length,
        expectedElement: new StrikeThrough("Hi"),
    });

    // https://github.github.com/gfm/#example-492
    notMatch({
        text: '~~has a\n'
    });
    notMatch({
        text: 'new paragraph~~.',
    });

});
