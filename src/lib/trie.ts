type SonType = TrieNode[] & { [index: string]: TrieNode };

export class TrieNode {
    private readonly ch: string;
    private readonly dep: number;
    private son: SonType;

    constructor(ch: string, dep: number = 0) {
        this.ch = ch;
        this.dep = dep;
        this.son = ([] as any as SonType);
    }

    insert_next(ch: string) {
        let child = new TrieNode(ch, this.dep + 1);
        if (this.son.length == 15) {
            this.switch_son_match_policy();
        }
        if (this.son.length >= 15) {
            this.son[ch] = child;
        } else {
            this.son.push(child);
        }
    }

    find_next(ch: string) {
        if (this.son.length > 15) {
            return this.son[ch];
        } else {
            for (let c of this.son) {
                if (c.ch == ch) {
                    return c;
                }
            }
        }
        return undefined;
    }

    private switch_son_match_policy() {
        let x: { [index: string]: TrieNode } = {};
        for (let c of this.son) {
            x[c.ch] = c;
        }
        this.son = (x as any as SonType);
    }
}

