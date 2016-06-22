# retext-sentiment [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

<!--lint disable heading-increment list-item-spacing-->

Sentiment detection with [**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-sentiment
```

**retext-sentiment** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

## Usage

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');
var sentiment = require('retext-sentiment');

retext().use(sentiment).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process(
    'I hate forgetting to bring a book somewhere I ' +
    'definitely should have brought a book to. ' +
    /*
     * Note that `bad` is a negative word, but that it's
     * classified as positive due to its preceding `not`
     * on parent (sentence, paragraph, root) level.
     */
    'This product is not bad at all. ' +
    /*
     * Emoji.
     */
    'Hai sexy! \ud83d\ude0f'
);
```

Yields:

```text
RootNode[1] [data={"polarity":6,"valence":"positive"}]
└─ ParagraphNode[5] [data={"polarity":6,"valence":"positive"}]
   ├─ SentenceNode[32] [data={"polarity":-3,"valence":"negative"}]
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'I'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1] [data={"polarity":-3,"valence":"negative"}]
   │  │  └─ TextNode: 'hate' [data={"polarity":-3,"valence":"negative"}]
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'forgetting'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'to'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'bring'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'a'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'book'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'somewhere'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'I'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'definitely'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'should'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'have'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'brought'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'a'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'book'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'to'
   │  └─ PunctuationNode: '.'
   ├─ WhiteSpaceNode: ' '
   ├─ SentenceNode[14] [data={"polarity":3,"valence":"positive"}]
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'This'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'product'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'is'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'not'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1] [data={"polarity":-3,"valence":"negative"}]
   │  │  └─ TextNode: 'bad' [data={"polarity":-3,"valence":"negative"}]
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'at'
   │  ├─ WhiteSpaceNode: ' '
   │  ├─ WordNode[1]
   │  │  └─ TextNode: 'all'
   │  └─ PunctuationNode: '.'
   ├─ WhiteSpaceNode: ' '
   └─ SentenceNode[6] [data={"polarity":6,"valence":"positive"}]
      ├─ WordNode[1]
      │  └─ TextNode: 'Hai'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"polarity":3,"valence":"positive"}]
      │  └─ TextNode: 'sexy' [data={"polarity":3,"valence":"positive"}]
      ├─ PunctuationNode: '!'
      ├─ WhiteSpaceNode: ' '
      └─ SymbolNode: '😏' [data={"polarity":3,"valence":"positive"}]
```

## API

### `retext().use(sentiment[, options])`

**retext-sentiment** automatically detects the sentiment of each
[`Text`][text] / [`WordNode`][word] (using [`wooorm/afinn-111`][afinn]
and [`wooorm/emoji-emotion`][emoticon]), and stores the valence in
`node.data.valence`, and polarity in `node.data.polarity`.

Valence?  Either `"neutral"`, `"positive"`, or `"negative"`.  Polarity?
A number between `-5` and `5` (both including).

In addition, the plugin exposes a calculated sentiment on parents
(sentences, paragraphs, and root nodes), through the same `valence`
and `polarity` properties.  This calculated sentiment includes negation,
so a word such as `bad`, with a polarity of `-3`, is calculated as `3`
when preceded by a word such as `not`, `neither`, `nor`, or a word ending
in `n't`.

###### `options`

*   `inject` (`Object`, optional) — Mapping strings (words, other
    symbols) to numbers.  Used to insert custom values, or overwrite
    existing values with new weights.

## Support

**retext-sentiment** supports all [`wooorm/afinn-111`][afinn] words
and [`wooorm/emoji-emotion`][emoticon] emoji / gemoji.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-sentiment.svg

[travis]: https://travis-ci.org/wooorm/retext-sentiment

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-sentiment.svg

[codecov]: https://codecov.io/github/wooorm/retext-sentiment

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/retext-sentiment/releases

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[text]: https://github.com/wooorm/nlcst#text

[word]: https://github.com/wooorm/nlcst#wordnode

[afinn]: https://github.com/wooorm/afinn-111

[emoticon]: https://github.com/wooorm/emoji-emotion
