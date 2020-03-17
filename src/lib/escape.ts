export function escapeHTML(s: string) {
    return s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}