# retext-sentiment [![Build Status](https://img.shields.io/travis/wooorm/retext-sentiment.svg?style=flat)](https://travis-ci.org/wooorm/retext-sentiment) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-sentiment.svg?style=flat)](https://coveralls.io/r/wooorm/retext-sentiment?branch=master)

Sentiment decetion with **[Retext](https://github.com/wooorm/retext)**.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-sentiment
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-sentiment
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install retext-sentiment
```

[Duo](http://duojs.org/#getting-started):

```javascript
var sentiment = require('wooorm/retext-sentiment');
```

## Usage

```javascript
var Retext = require('retext');
var visit = require('retext-visit');
var sentiment = require('retext-sentiment');

var retext = new Retext()
    .use(visit)
    .use(sentiment);

retext.parse(
    'Haha hanks and happy birthday!!!!! ' +
    'I hate forgetting to bring a book somewhere I ' +
    'definitely should have brought a book to. ' +
    /**
     * Note that `bad` is a negative word, but that it's
     * classified as positive due to its preceding `not`
     * on parent (sentence, paragraph, root) level.
     */
    'This product is not bad at all.',
    function (err, tree) {
        console.log(tree.data.valence, tree.data.polarity);
        /**
         * Logs: 'positive', 6
         */

        tree.visit(tree.SENTENCE_NODE, function (node) {
            console.log(node.data.valence, node.data.polarity);
        });
        /**
         * Logs:
         * 'positive', 6
         * 'negative', -3
         * 'positive', 3
         */

        tree.visit(tree.WORD_NODE, function (node) {
            if (node.data.polarity) {
                console.log(node.toString(), node.data.valence, node.data.polarity);
            }
        });
        /**
         * Logs:
         * 'Haha', 'positive', 3
         * 'happy', 'positive', 3
         * 'hate', 'negative', -3
         * 'bad', 'negative', -3
         */
    }
);
```

**retext-sentiment** knows about the sentiment of emoji, gemoji, and emoticons too, and works great with [**wooorm/retext-emoji**](https://github.com/wooorm/retext-emoji):

```javascript
var Retext = require('retext');
var emoji = require('retext-emoji');
var inspect = require('retext-inspect');
var sentiment = require('retext-sentiment');

var retext = new Retext()
    .use(emoji)
    .use(inspect)
    .use(sentiment);

retext.parse('Hai sexy! \ud83d\ude0f', function (err, tree) {
    console.log(tree.head.head);
    /**
     * SentenceNode[6] [data={"polarity":6,"valence":"positive"}]
     * ├─ WordNode[1] [data={"polarity":0,"valence":"neutral"}]
     * │  └─ TextNode: 'Hai' [data={"polarity":0,"valence":"neutral"}]
     * ├─ WhiteSpaceNode: ' ' [data={"polarity":0,"valence":"neutral"}]
     * ├─ WordNode[1] [data={"polarity":3,"valence":"positive"}]
     * │  └─ TextNode: 'sexy' [data={"polarity":3,"valence":"positive"}]
     * ├─ PunctuationNode: '!' [data={"polarity":0,"valence":"neutral"}]
     * ├─ WhiteSpaceNode: ' ' [data={"polarity":0,"valence":"neutral"}]
     * └─ EmoticonNode: '😏' [data={"names":["smirk"],"description":"smirking face","tags":["smug"],"polarity":3,"valence":"positive"}]
     */
});
```

## Supported Words

**retext-sentiment** supports all **[wooorm/afinn-111](https://github.com/wooorm/afinn-111#supported-words)** words and **[wooorm/emoji-emotion](https://github.com/wooorm/emoji-emotion#supported-emoji)** emoji/gemoji.

## API

```javascript
new Retext().use(sentiment, {
    'cat': -3,
    'dog': 3
});
```

- Options (`Object` or `null`) — Mapping strings (words, other symbols) to numbers. Used to insert custom values, or overwrite existing values with new weights.

**retext-sentiment** automatically detects the sentiment of each [`Text`](https://github.com/wooorm/textom#textomtextvalue-nlcsttext)/[`WordNode`](https://github.com/wooorm/textom#textomwordnode-nlcstwordnode) (using [**wooorm/afinn-111**](https://github.com/wooorm/afinn-111) and [**wooorm/emoji-emotion**](https://github.com/wooorm/emoji-emotion)), and stores the valence in `node.data.valence`, and polarity in `node.data.polarity`.

Valence? Either `"neutral"`, `"positive"`, or `"negative"`. Polarity? A number between `-5` and `5` (both including).

In addition, the plugin exposes a calculated sentiment on parents (sentences, paragraphs, and root nodes), through the same `valence` and `polarity` properties. This calculated sentiment includes negation, so a word such as `bad`, with a polarity of `-3`, is calculated as `3` when preceded by a word such as `not`, `neither`, `nor`, or a word ending in `n't`.

## Performance

On a MacBook Air. **retext** works about 52% slower, when using **retext-sentiment**.

```text
           retext w/o retext-sentiment
  189 op/s » A paragraph (5 sentences, 100 words, lots of sentiment)
  232 op/s » A paragraph (5 sentences, 100 words, no sentiment)

           retext w/ retext-sentiment
   90 op/s » A paragraph (5 sentences, 100 words, lots of sentiment)
  111 op/s » A paragraph (5 sentences, 100 words, no sentiment)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
