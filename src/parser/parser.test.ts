import {StringStream} from "..";
import {cn_book_md, latex_md, math_md} from "../lib/data.test";
import {Parser} from "./parser";
import {newRules} from "../rules";


describe(
    'parser', () => {
        let ctx = new Parser(newRules({enableLaTeX: true}));
        it('process math.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(math_md)), undefined, 2));
        });
        it('process latex.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(latex_md)), undefined, 2));
        });
        it('process data.md', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream(cn_book_md)), undefined, 2));
        });

        it('process hr/list-break', () => {

            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream('* hello\n' +
                'world\n' +
                '* how\n' +
                'are\n' +
                '* * *\n' +
                'you today?')), undefined, 2));
        });

        it('process nested block-quotes block', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream('> ## This is a header.\n' +
                '> \n' +
                '> 1.   This is the first list item.\n' +
                '> 2.   This is the second list item.\n' +
                '> \n' +
                '> Here\'s some example code:\n' +
                '> \n' +
                '>     return shell_exec("echo $input | $markdown_script");\n')), undefined, 2));
        });

        it('process std list block', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream('1.  This is a list item with two paragraphs. Lorem ipsum dolor\n' +
                '    sit amet, consectetuer adipiscing elit. Aliquam hendrerit\n' +
                '    mi posuere lectus.\n' +
                '\n' +
                '    Vestibulum enim wisi, viverra nec, fringilla in, laoreet\n' +
                '    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum\n' +
                '    sit amet velit.')), undefined, 2));
        });

        it('process std code block', () => {
            console.log(JSON.stringify(ctx.parseBlockElements(new StringStream('    <div class="footer">\n' +
                '        &copy; 2004 Foo Corporation\n' +
                '    </div>')), undefined, 2));
        })


    }
);