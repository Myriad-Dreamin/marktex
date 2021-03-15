import myriad from '../src';
import * as fs from 'fs';

const driver = myriad.newRenderDriver({
    enableLaTeX: false,
    enableGFMRules: true,
    enableHtml: true,
});

function main() {
    const rawContent = fs.readFileSync(process.argv[2])
        .toString('utf8').replace(/\r\n/gm, '\n');
    console.error(rawContent);
    const renderResult = `<html lang="en">
<head>
    <title>Test</title>
    <meta charset="UTF-8">
    <script src="https://cdn.bootcss.com/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
        window.MathJax.Hub.Config({
            showProcessingMessages: true,
            messageStyle: 'none',
            // elements: document.getElementsByClassName('markdown-body'),
            extensions: ['tex2jax.js'],
            jax: ['input/TeX', 'output/HTML-CSS'],
            tex2jax: {
                inlineMath: [['$', '$']],
                displayMath: [['$$', '$$']],
                skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
                ignoreClass: 'comment-content'
            },
            'HTML-CSS': {
                availableFonts: ['STIX', 'TeX'],
                showMathMenu: false
            }
        });

        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);

    </script>
</head>
<body>
${driver.renderString(rawContent)}
</body>
</html>`
    if (process.argv.length >= 5) {
        fs.writeFileSync(process.argv[4], renderResult);
    } else {
        console.log(renderResult);
    }
}


main();
