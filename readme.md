# retext-sentiment [![Build Status](https://img.shields.io/travis/wooorm/retext-sentiment.svg)](https://travis-ci.org/wooorm/retext-sentiment) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-sentiment.svg)](https://codecov.io/github/wooorm/retext-sentiment)

Sentiment detection with [**Retext**](https://github.com/wooorm/retext).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-sentiment
```

**retext-sentiment** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-sentiment.js) and
[compressed](retext-sentiment.min.js).

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

### [retext](https://github.com/wooorm/retext#api)\.[use](https://github.com/wooorm/retext#retextuseplugin-options)([sentiment](#api)\[, options\])

```javascript
retext().use(sentiment, {
    'cat': -3,
    'dog': 3
});
```

**retext-sentiment** automatically detects the sentiment of each [`Text`](https://github.com/wooorm/nlcst#text)/[`WordNode`](https://github.com/wooorm/nlcst#wordnode) (using [**wooorm/afinn-111**](https://github.com/wooorm/afinn-111) and [**wooorm/emoji-emotion**](https://github.com/wooorm/emoji-emotion)), and
stores the valence in `node.data.valence`, and polarity in `node.data.polarity`.

Valence? Either `"neutral"`, `"positive"`, or `"negative"`. Polarity? A number
between `-5` and `5` (both including).

In addition, the plugin exposes a calculated sentiment on parents (sentences,
paragraphs, and root nodes), through the same `valence` and `polarity`
properties.
This calculated sentiment includes negation, so a word such as `bad`, with a
polarity of `-3`, is calculated as `3` when preceded by a word such as `not`,
`neither`, `nor`, or a word ending in `n't`.

**Parameters**:

*   `sentiment` — This module;

*   `inject` (`Object`, optional) — Mapping strings (words, other symbols)
    to numbers. Used to insert custom values, or overwrite existing values with
    new weights.

## Supported Words

**retext-sentiment** supports all [**wooorm/afinn-111**](https://github.com/wooorm/afinn-111#supported-words)
words and [**wooorm/emoji-emotion**](https://github.com/wooorm/emoji-emotion#supported-emoji)
emoji/gemoji.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
