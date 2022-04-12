import myriad from '../src';
import * as fs from 'fs';
import * as path from 'path';

const driver = myriad.newRenderDriver({
    enableLaTeX: true,
    enableGFMRules: true,
    enableHtml: true,
});

function fuzz(buf: Buffer) {
    return driver.renderString(buf.toString('utf-8'));
}


if (process.argv.length === 4) {
    switch (process.argv[2]) {
    case "exec":
        fuzz(fs.readFileSync(process.argv[3]));
        break;
    case "repro":
        const a = process.argv[3];
        for (let i of fs.readdirSync(a)) {
            fuzz(fs.readFileSync(path.join(a, i)));
        }
        break;
    }

}

module.exports = {
    fuzz
}
