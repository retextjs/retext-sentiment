# retext-sentiment [![Build Status](https://img.shields.io/travis/wooorm/retext-sentiment.svg?style=flat)](https://travis-ci.org/wooorm/retext-sentiment) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-sentiment.svg?style=flat)](https://coveralls.io/r/wooorm/retext-sentiment?branch=master)

Detect the sentiment of text with **[Retext](https://github.com/wooorm/retext "Retext")**.

## Installation

npm:
```sh
$ npm install retext-sentiment
```

Component:
```sh
$ component install wooorm/retext-sentiment
```

Bower:
```sh
$ bower install retext-sentiment
```

## Usage

```js
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

## Supported Words

**retext-sentiment** supports all words **[wooorm/afinn-111](https://github.com/wooorm/afinn-111#supported-words)** supports.

## API

None, **retext-sentiment** automatically detects the sentiment of each word (using **[wooorm/afinn-111](https://github.com/wooorm/afinn-111)**), and stores the valence in `word.data.valence`, and polarity in `word.data.polarity`.

In addition, the plugin exposes the average of the detected sentiment on parents (sentences, paragraphs, and root nodes), through the same `valence` and `polarity` properties.

Valence? Either `"neutral"`, `"positive"`, or `"negative"`.
Polarity? A number between `-5` and `5` (both including).

## License

MIT © [Titus Wormer](http://wooorm.com)
