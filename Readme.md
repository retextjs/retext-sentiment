# retext-sentiment [![Build Status](https://travis-ci.org/wooorm/retext-sentiment.svg?branch=master)](https://travis-ci.org/wooorm/retext-sentiment) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-sentiment.svg)](https://coveralls.io/r/wooorm/retext-sentiment?branch=master)

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
var Retext = require('retext'),
    visit = require('retext-visit'),
    sentiment = require('retext-sentiment'),
    retext, tree;

retext = new Retext()
    .use(visit)
    .use(sentiment);

tree = retext.parse(
    'Haha hanks and happy birthday!!!!! ' +

    'I hate forgetting to bring a book somewhere I ' +
    'definitely should have brought a book to. ' +

    'Hate having to wait a whole week until the next game now.'
);

console.log(tree.data.valence, tree.data.polarity); // 'neutral', 0

tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
    console.log(sentenceNode.data.valence, sentenceNode.data.polarity);
});
/*
 * 'positive', 6
 * 'negative', -3
 * 'negative', -3
 */

tree.visitType(tree.WORD_NODE, function (wordNode) {
    if (!wordNode.data.polarity) {
        return;
    }

    console.log(wordNode.toString(), wordNode.data.valence);
});
/*
 * 'Haha', 'positive'
 * 'happy', 'positive'
 * 'hate', 'negative'
 * 'Hate', 'negative'
 */
```

The example also uses [retext-visit](https://github.com/wooorm/retext-visit).

## Supported Words
**retext-sentiment** supports all words [wooorm/afinn-111](https://github.com/wooorm/afinn-111#supported-words) supports.

## API
None, the plugin automatically detects the sentiment of each word (using [wooorm/afinn-111](https://github.com/wooorm/afinn-111)) when it’s created or changed, and stores the valence in `word.data.valence`, and polarity in `word.data.polarity`.

In addition, the plugin exposes the average of the detected sentiment on sentences, paragraphs, and root nodes, through the same `valence` and `polarity` properties.

Valence is either `"neutral"`, `"positive"`, or `"negative"`.

Polarity is between `-5` and `5` (both including).

## License

MIT © Titus Wormer
