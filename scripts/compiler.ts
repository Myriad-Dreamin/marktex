import myriad from '../src';
import * as fs from 'fs';

const driver = myriad.newRenderDriver({
    enableLaTeX: true,
    enableGFMRules: true,
    enableHtml: true,
});

function main() {
    const rawContent = fs.readFileSync(process.argv[2])
        .toString('utf8').replace(/\r\n/gm, '\n');
    // console.error(rawContent);
    const renderResult = `
        <html lang="en">
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
            <!--    <link rel="stylesheet" type="text/css" href="https://latex.now.sh/style.css">-->

            <!--Garamond -->
            <style>
                @font-face {
                    font-family: 'Latin Modern';
                    font-style: normal;
                    font-weight: normal;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/LM-regular.woff2') format('woff2'),
                    url('https://latex.now.sh/fonts/LM-regular.woff') format('woff'),
                    url('https://latex.now.sh/fonts/LM-regular.ttf') format('truetype');
                }

                @font-face {
                    font-family: 'Latin Modern';
                    font-style: italic;
                    font-weight: normal;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/LM-italic.woff2') format('woff2'),
                    url('https://latex.now.sh/fonts/LM-italic.woff') format('woff'),
                    url('https://latex.now.sh/fonts/LM-italic.ttf') format('truetype');
                }

                @font-face {
                    font-family: 'Latin Modern';
                    font-style: normal;
                    font-weight: bold;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/LM-bold.woff2') format('woff2'),
                    url('https://latex.now.sh/fonts/LM-bold.woff') format('woff'),
                    url('https://latex.now.sh/fonts/LM-bold.ttf') format('truetype');
                }

                @font-face {
                    font-family: 'Latin Modern';
                    font-style: italic;
                    font-weight: bold;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/LM-bold-italic.woff2') format('woff2'),
                    url('https://latex.now.sh/fonts/LM-bold-italic.woff') format('woff'),
                    url('https://latex.now.sh/fonts/LM-bold-italic.ttf') format('truetype');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: normal;
                    font-weight: normal;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-regular.woff2') format('woff2');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: italic;
                    font-weight: normal;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-italic.woff2') format('woff2');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: normal;
                    font-weight: bold;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-bold.woff2') format('woff2');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: italic;
                    font-weight: bold;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-bold-italic.woff2') format('woff2');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: normal;
                    font-weight: 600;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-semibold.woff2') format('woff2');
                }

                @font-face {
                    font-family: 'Libertinus';
                    font-style: italic;
                    font-weight: 600;
                    font-display: swap;
                    src: url('https://latex.now.sh/fonts/Libertinus-semibold-italic.woff2') format('woff2');
                }

                .latex-container {
                    font-family: 'Latin Modern', Georgia, Cambria, 'Times New Roman', Times, serif;
                    line-height: 1.8;
                }

                .latex-container h1 {
                    text-align: center;
                }

                .latex-container h1 {
                    font-size: 2rem;
                    line-height: 2.6rem;
                    margin-bottom: 1.15rem;
                }

                .latex-container .section-number {
                    margin-right: 0.75em;
                }

                .latex-container .indent {
                    margin-right: 2em;
                }

                body {
                    margin: 80px 40px;
                }
            </style>
        </head>
        <body>
        <div class="latex-container">
            ${driver.renderString(rawContent)}
        </div>
        </body>
        </html>`
    if (process.argv.length >= 5) {
        fs.writeFileSync(process.argv[4], renderResult);
    } else {
        console.log(renderResult);
    }
}


main();
