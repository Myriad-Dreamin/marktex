export function escapeHTML(s: string) {
    return s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const escapeChars = "\\`_*!#+-.[]{}()";

export function unescapeBackSlash(s: string): string {
    let res = "", q = 0, la: string = 'a';
    for (let i = 0; i < s.length; i++) {
        if (la === '\\' && escapeChars.includes(s[i])) {
            res += s.slice(q, i - 1);
            q = i;
            la = 'a';
        } else {
            la = s[i];
        }
    }
    if (q < s.length) {
        return res + s.slice(q);
    }
    return res
}