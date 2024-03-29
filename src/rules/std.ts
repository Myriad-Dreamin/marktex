import {Rule, RuleContext} from './rule';
import {forwardRegexp, IStringStream, StringStream} from '../lib/stream';
import {
  CodeBlock,
  Emphasis,
  HeaderBlock,
  Horizontal,
  HTMLBlock,
  ImageLink,
  InlineCode,
  InlineParagraph,
  InlinePlain,
  Link,
  LinkDefinition,
  ListBlock,
  ListElement,
  MaybeToken,
  NewLine,
  Paragraph,
  Quotes,
} from '../token/token';
import {unescapeBackSlash} from '../lib/escape';


// Standard Markdown Rules
// https://daringfireball.net/projects/markdown/syntax
// Standard Block Rules
//     NewLine
//     Quotes
//     List
//     Code
//     Header
//     Horizontal
//     LinkDefinition
//     HTML
//     Paragraph
// Standard Inline Rules
//     Link
//     ImageLink
//     Emphasis
//     Code
//

function maybeForward(s: IStringStream, r: RegExp): RegExpExecArray | undefined {
  const capturing = r.exec(s.source);
  if (!capturing) {
    return undefined;
  }
  forwardRegexp(s, capturing);
  return capturing;
}

function maybePickRegexParts(s: IStringStream, r: RegExp): IStringStream[] | undefined {
  const capturing = r.exec(s.source);
  if (capturing === null) {
    return undefined;
  }

  const res = [];
  for (let i = 1; i < capturing.length; i++) {
    res.push(s.breakAt(capturing[i]?.length || 0));
  }
  return res;
}

function maybeTrue(b: unknown): true | undefined {
  return b ? true : undefined;
}

export class NewLineRule implements Rule {
  readonly name: string = 'Standard/Block/NewLine';
  readonly description: string = 'Standard Markdown Block Rule';

  public readonly regex: RegExp = /^\n+/;

  public first: string[] = [];

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new NewLine(capturing[0]);
  }
}

export class ParagraphRule implements Rule {
  readonly name: string = 'Standard/Block/Paragraph';
  readonly description: string = 'Standard Markdown Block Rule';

  // public readonly regex: RegExp = /^(?:(?:[^$]|\$(?!\$))(?:\n|$)?)+/;

  constructor() {
  }

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    return maybeTrue(s.source.length > 0 && s.source[0] != '\n') && new Paragraph(
      ctx.parseInlineElements(s.maybeBreakAt(s.source.indexOf('\n'))));
  }
}

export class LazyParagraphRule implements Rule {
  readonly name: string = 'Standard/Block/Paragraph';
  readonly description: string = 'Standard Markdown Block Rule';

  // public readonly regex: RegExp = /^(?:(?:[^$]|\$(?!\$))(?:\n|$)?)+/;

  constructor() {
  }

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    return maybeTrue(s.source.length > 0 && s.source[0] != '\n') && new InlineParagraph(s.maybeBreakAt(s.source.indexOf('\n')));
  }
}

export class QuotesRule implements Rule {
  readonly name: string = 'Standard/Block/Quotes';
  readonly description: string = 'Standard Markdown Block Rule';

  public readonly regex: RegExp = /^( *>[^\n]*(?:\n[^\n]+)*\n?)+/;

  public first: string[] = ['>'];

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new Quotes(ctx.parseBlockElements(
      // todo slice
      new StringStream(capturing[0].replace(/^ *>[\t\v\f\r ]?/gm, '')),
    ));
  }
}

export class CodeBlockRule implements Rule {
  readonly name: string = 'Standard/Block/CodeBlock';
  readonly description: string = 'Standard Markdown Block Rule';

  public readonly regex: RegExp = /^((?: {4}| {0,3}\t)[^\n]+(\n|$))+/;

  public first: string[] = ['    ', '\t'];

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    // todo slice
    return capturing && new CodeBlock(capturing[0].replace(/^(?: {4}| {0,3}\t)/gm, ''));
  }
}

export class HeaderBlockRule implements Rule {
  readonly name: string = 'Standard/Block/HeaderBlock';
  readonly description: string = 'Standard Markdown Block Rule';

  public readonly atxRegex: RegExp = /^(#{1,6})([\t\f\v\r ])([^\n]*?)(#*(?:\n|$))/;
  public readonly setextRegex: RegExp = /^([^\n]+)(\n=+(?:\n|$))/;

  public first: string[] = ['#'];

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    return this.matchATX(s, ctx) || this.matchSetext(s, ctx);
  }

  matchATX(s: IStringStream, ctx: RuleContext): MaybeToken {
    const capturing = maybePickRegexParts(s, this.atxRegex);
    return capturing && new HeaderBlock(ctx.parseInlineElements(capturing[2]), capturing[0].length);
  }

  matchSetext(s: IStringStream, ctx: RuleContext): MaybeToken {
    const capturing = maybePickRegexParts(s, this.setextRegex);
    return capturing && new HeaderBlock(ctx.parseInlineElements(capturing[0]), 1);
  }
}

export class HorizontalRule implements Rule {
  readonly name: string = 'Standard/Block/Horizontal';
  readonly description: string = 'Standard Markdown Block Rule';

  public readonly regex: RegExp = /^(?:(?:\*[\r\t ]*){3,}|(?:-[\r\t ]*){3,})(?:\n|$)/;

  public first: string[] = ['*', '-'];

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new Horizontal();
  }
}

export class LinkDefinitionRule implements Rule {
  readonly name: string = 'Standard/Block/LinkDefinition';
  readonly description: string = 'Standard Markdown Block Rule';
  public readonly regex: RegExp = /^b*\[((?:\\\\|\\]|[^\]])+)]: *<?([^\s>]+)>?(?: +["'(]([^\n]*)["')])? *(?:\n|$)/;

  public first: string[] = ['['];

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = this.regex.exec(s.source);
    if (capturing === null) {
      return undefined;
    }
    forwardRegexp(s, capturing);
    return new LinkDefinition(unescapeBackSlash(capturing[1]), capturing[2], capturing[3]);
  }
}

enum ListBlockMatchState {
  FindStartNumber = 0,
  PushListElement = 1,
  MatchBodyLine = 2,
  Final = 3,
}

export class ListBlockRule implements Rule {

  constructor({enableGFMRules}: { enableGFMRules?: boolean }) {
    this.enableGFMRules = enableGFMRules || false;
  }

  public static readonly gfmSelectorRule = /^\s{0,3}\[([ x])]\s*/;
  // ^((?:[^\n]+(?:\n|$)(?=[^0-9*+-])(\n(?=[^0-9*+-]))?)+)
  // ^(?:(?:[^\n]*)(?:\n|$)\n?)(?:(?=[^0-9*+-])(?:[^\n]+)(?:\n|$)\n?)*
  public static readonly listBlockRegex = /^(?:(?:[^\n]*)(?:\n|$))(?:(?=\n?[^0-9*+-])(?:[^\n]+)(?:\n|$))*/;
  /**
   * undefined behavior:
   * + a
   * [ ]{2}
   * + 1
   *
   * will parsed into:
   * {+ }{a
   * [ ]{2}}
   * {+ }{1}
   */
  public static readonly matchIndentedBody = /^(?:\s*?(?:(?:[\r\f\v ]{2,}|[\r\f\v ]*\t[\r\f\v ]*)[^\n]*(?:\n|$)))*/;
  public static readonly replaceRegex = /^[ \v\r\f]?[ \v\r\f\t]/gm;
  readonly name: string = 'Standard/Block/ListBlock';
  readonly description: string = 'Standard Markdown Block Rule';
  private readonly enableGFMRules: boolean;

  public first: string[] = ['+', '-', '*', '[0-9]+\.'];


  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    // todo: \t?
    let lookAheadRegex = /^[\r\v\f ]{0,3}([*+-]|[0-9]+\.)[\t\r\v\f ]/;
    let capturing = lookAheadRegex.exec(s.source);
    if (!capturing) {
      return undefined;
    }
    let currMarker: string = capturing[1];
    forwardRegexp(s, capturing);

    let newLineSeparated = false;
    let maybeNewlineSeparated = false;
    let nextMarker = '';
    let pleNextState: ListBlockMatchState = ListBlockMatchState.Final;


    const listBodies: string[] = [];

    const matchFullLineBody = () => {
      let readPtr = 0;
      while (readPtr < s.source.length && s.at(readPtr) !== '\n') {
        readPtr++;
      }
      maybeNewlineSeparated = readPtr < s.source.length;
      if (maybeNewlineSeparated) {
        readPtr++;
      }
      if (readPtr) {
        listBodies.push(s.source.slice(0, readPtr));
        s.forward(readPtr);
      }
    };
    matchFullLineBody();

    const ordered = '0' <= currMarker && currMarker <= '9';
    const listBlockEl = new ListBlock(ordered);

    if (ordered) {
      currMarker = currMarker.slice(0, currMarker.length - 1);
      lookAheadRegex = /^[\r\v\f ]?([0-9]+)\.[\t\r\v\f ]/;
    } else {
      lookAheadRegex = /^[\r\v\f ]?([*+-])[\t\r\v\f ]/;
    }


    let state = ListBlockMatchState.MatchBodyLine;
    for (; ;) {
      switch (state) {
        case ListBlockMatchState.FindStartNumber:
          capturing = lookAheadRegex.exec(s.source);
          if (!capturing) {
            nextMarker = '';
            if (newLineSeparated) {
              state = currMarker.length ? ListBlockMatchState.PushListElement : ListBlockMatchState.Final;
            } else {
              matchFullLineBody();
              if (maybeNewlineSeparated) {
                state = ListBlockMatchState.MatchBodyLine;
              } else {
                state = currMarker.length ? ListBlockMatchState.PushListElement : ListBlockMatchState.Final;
              }
            }
          } else {
            nextMarker = capturing[1];
            forwardRegexp(s, capturing);
            state = ListBlockMatchState.PushListElement;
            pleNextState = ListBlockMatchState.MatchBodyLine;
          }
          break;
        case ListBlockMatchState.PushListElement:
          listBlockEl.listElements.push(new ListElement(currMarker, ctx.parseBlockElements(
            new StringStream((listBodies[0] || '') + listBodies.slice(1).join('')
              .replace(ListBlockRule.replaceRegex, '')),
          ), newLineSeparated, undefined));
          currMarker = nextMarker;
          listBodies.splice(0, listBodies.length);
          if (nextMarker.length) {
            matchFullLineBody();
            // match end
            if (!maybeNewlineSeparated) {
              currMarker = nextMarker;
              nextMarker = '';
              if (currMarker.length) {
                pleNextState = ListBlockMatchState.PushListElement;
                newLineSeparated = false;
              } else {
                pleNextState = ListBlockMatchState.Final;
              }
            }
          }
          state = pleNextState;
          pleNextState = ListBlockMatchState.Final;
          break;
        case ListBlockMatchState.MatchBodyLine:
          capturing = ListBlockRule.matchIndentedBody.exec(s.source)!;
          if (capturing[0].length) {
            listBodies.push(capturing[0]);
            maybeNewlineSeparated = capturing[0].endsWith('\n');
            forwardRegexp(s, capturing);
          }
          capturing = (/^\s*/m.exec(s.source))!;
          if (maybeNewlineSeparated) {
            newLineSeparated = capturing[0].indexOf('\n') !== -1;
          }
          forwardRegexp(s, capturing);
          maybeNewlineSeparated = false;
          state = ListBlockMatchState.FindStartNumber;
          break;
        case ListBlockMatchState.Final:
          return listBlockEl;
        default:
          throw new Error(`unknown state: ${state}`);
      }
    }
  }
}

export interface RegExpWithTagName {
  exec(string: string): RegExpExecArray | null;

  getTagName(g: RegExpExecArray): string;
}

export interface OpenTagRegExp extends RegExpWithTagName {
  isSingleton(g: RegExpExecArray): boolean;
}

export interface HTMLBlockOptions {
  open_tag?: OpenTagRegExp;
  close_tag?: RegExpWithTagName;
  others?: RegExp;
  safeHTMLTagFilter?: (tag: string) => boolean;
}

function defaultValidTags() {
  /// ^<([a-zA-Z][a-zA-Z0-9-]*)(?:\s+(?:[a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:[^\/\s'"=<>`]|'[^']*'|"[^"]*"))?)*\s*(\/?)>/
  const ot: any = /^<([a-zA-Z][\w-]*)(?:\s+(?:[\w:@][\w.:-]*)(?:\s*=\s*(?:[^\/\s'"=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/?)>/;
  /// ^(?:<\/((?:[a-zA-Z][a-zA-Z0-9-]*))\s*>)/
  const ct: any = /^<\/(\w+)\s*>/;

  ct.getTagName = ot.getTagName = function (g: RegExpExecArray): string {
    return g[1];
  };
  ot.isSingleton = function (g: RegExpExecArray): boolean {
    return g[2] === '/';
  };

  return {
    open_tag: ot,
    close_tag: ct,
    /// ^(?:<!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->)|(?:<\?(?:(?!\?>).)*\?>)|(?:<![A-Z]+[^>]*>)|(?:<!\[CDATA(?:(?!]]>)\s\S)*]]>)/
    others: /^<(?:!--(?:[^>-]|-[^>])(?:[^-]|-?[^-])*[^-]-->|\?(?:(?!\?>)[\s\S])*\?>|![A-Z]+[^>]*>|!\[CDATA(?:(?!]]>)\s\S)*]]>)/,
  };
}

export class HTMLBlockRule implements Rule {
  readonly name: string = 'Standard/Block/HTMLBlock';
  readonly description: string = 'Standard Markdown Block Rule';
  protected readonly openTag: OpenTagRegExp;
  protected readonly closeTag: RegExpWithTagName;
  protected readonly others: RegExp;
  protected readonly safeHTMLTagFilter?: (tag: string) => boolean;

  public first: string[] = ['<\\w+'];

  constructor(options?: HTMLBlockOptions) {
    const v = Object.assign(options || {}, defaultValidTags());
    this.openTag = v.open_tag;
    this.closeTag = v.close_tag;
    this.others = v.others;
    this.safeHTMLTagFilter = v.safeHTMLTagFilter;
  }

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    if (s.source[0] !== '<') {
      return undefined;
    }
    return this.matchBlock(s) || this.matchOthers(s);
  }

  matchBlock(s: IStringStream): MaybeToken {
    const capturing = this.filterTag(s, this.openTag);
    if (capturing === null) {
      return undefined;
    }

    if (this.openTag.isSingleton(capturing)) {
      forwardRegexp(s, capturing);
      return new HTMLBlock(capturing[0]);
    }

    return this.gfmStyleForward(s, capturing, false);
  }

  matchOthers(s: IStringStream): MaybeToken {
    const capturing = this.filterTag(s, this.closeTag) || this.others.exec(s.source);
    if (capturing === null) {
      return undefined;
    }

    return this.gfmStyleForward(s, capturing, true);
  }

  filterTag(s: IStringStream, filter: { exec(s: string): RegExpExecArray | null, getTagName(r: RegExpExecArray): string }) {

    const capturing = filter.exec(s.source);
    if (capturing === null) {
      return null;
    }
    const tag: string = filter.getTagName(capturing);
    if (this.safeHTMLTagFilter && !this.safeHTMLTagFilter(tag)) {
      return null;
    }
    return capturing;
  }

  gfmStyleForward(s: IStringStream, capturing: RegExpExecArray, otherBlock: boolean): HTMLBlock {

    forwardRegexp(s, capturing);

    // <!--, <?, <!, <![CDATA[
    if (otherBlock) {
      return new HTMLBlock(capturing[0]);
    }
    let lastChar = 'a';
    let i = 0;
    for (; i < s.source.length; i++) {
      if (lastChar === '\n' && '\n' === s.source[i]) {
        i--;
        break;
      }
      lastChar = s.source[i];
    }

    const res = capturing[0] + s.source.slice(0, i);
    s.forward(i);
    return new HTMLBlock(res);
  }
}

export class InlinePlainExceptSpecialMarksRule implements Rule {
  readonly name: string = 'Standard/Inline/InlinePlainExceptSpecialMarks';
  readonly description: string = 'Standard Markdown Inline Rule';

  public readonly regex: RegExp = /^(?:\\[!`_*\[$\\]|[^<!`_*\[$\\])+/;

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new InlinePlain(unescapeBackSlash(capturing[0]));
  }
}

export class InlinePlainRule implements Rule {
  readonly name: string = 'Standard/Inline/InlinePlain';
  readonly description: string = 'Standard Markdown Inline Rule';

  public readonly regex: RegExp = /^(?:[!`_*\[$\\<](?:\\[!`_*\[$\\]|[^<!`_*\[$\\])*|(?:\\[!`_*\[$\\]|[^<!`_*\[$\\])+)/;

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new InlinePlain(unescapeBackSlash(capturing[0]));
  }
}

export class LinkOrImageRule implements Rule {
  readonly name: string = 'Standard/Inline/Link';
  readonly description: string = 'Standard Markdown Inline Rule';

  public readonly regex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/;
  public readonly refRegex: RegExp = /^(!?)\[((?:\[[^\]]*]|[^\[\]]|](?=[^\[]*]))*)]\[((?:\\\\|\\]|[^\]])*)]/;
  public readonly autoLinkRegex: RegExp =
    /^<(?:(?:mailto|MAILTO):([\w.!#$%&'*+\/=?^`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)|([a-zA-Z][a-zA-Z\d+.-]{1,31}:[^<>\s]*))>/;

  match(s: IStringStream, ctx: RuleContext): MaybeToken {
    return this.matchInline(s, ctx) || this.matchAutoLink(s, ctx) || this.matchRef(s, ctx);
  }

  matchInline(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    if (!capturing) {
      return undefined;
    }
    if (capturing[1] !== '') {
      return new ImageLink(unescapeBackSlash(capturing[2]), capturing[3], true, capturing[4]);
    } else {
      return new Link(unescapeBackSlash(capturing[2]), capturing[3], true, capturing[4]);
    }
  }

  matchAutoLink(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.autoLinkRegex);
    if (!capturing) {
      return undefined;
    }
    if (capturing[1] !== undefined) {
      return new Link(capturing[1], 'mailto:' + capturing[1], true);
    } else {
      return new Link(capturing[2], capturing[2], true);
    }
  }

  matchRef(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.refRegex);
    if (!capturing) {
      return undefined;
    }
    if (capturing[1] !== '') {
      return new ImageLink(capturing[2], capturing[3], false);
    } else {
      return new Link(capturing[2], capturing[3], false);
    }
  }
}

export class EmphasisRule implements Rule {
  readonly name: string = 'Standard/Inline/Emphasis';
  readonly description: string = 'Standard Markdown Inline Rule';

  public readonly regex: RegExp = /^(?:(_{1,2})((?:\\\\|\\_|[^\\_])+)(_{1,2})|(\*{1,2})((?:\\\\|\\\*|[^\\*])+)(\*{1,2}))/;

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = this.regex.exec(s.source);
    if (capturing === null) {
      return undefined;
    }

    const l: string = capturing[1] || capturing[4], r: string = capturing[3] || capturing[6];
    if (l !== r) {
      if (l.length < r.length) {
        s.forward(capturing[0].length - 1);
        return new Emphasis(unescapeBackSlash(capturing[2] || capturing[5]), l.length);
      }
      return undefined;
    }

    forwardRegexp(s, capturing);
    return new Emphasis(unescapeBackSlash(capturing[2] || capturing[5]), l.length);
  }
}

export class InlineCodeRule implements Rule {
  readonly name: string = 'Standard/Inline/InlineCode';
  readonly description: string = 'Standard Markdown Inline Rule';

  public readonly regex: RegExp = /^(?:``([^`\n\r\u2028\u2029](?:\\\\|\\`|`?[^`\n\r\u2028\u2029])*)``|`((?:\\\\|\\`|[^`\n\r\u2028\u2029])+)`)/;

  match(s: IStringStream, _: RuleContext): MaybeToken {
    const capturing = maybeForward(s, this.regex);
    return capturing && new InlineCode(unescapeBackSlash(capturing[1] || capturing[2]));
  }
}
