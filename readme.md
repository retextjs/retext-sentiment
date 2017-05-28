# retext-sentiment [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Sentiment detection with [**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-sentiment
```

## Usage

Say we have the following file, `example.txt`:

```text
I hate forgetting to bring a book somewhere I
definitely should have brought a book to.

This product is not bad at all.

Hai sexy! 😏
```

You’ll note that `bad` is a negative word, but that it’s actually positive
as it’s preceded by `not`.

And our script, `example.js`, looks like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var inspect = require('unist-util-inspect');
var unified = require('unified');
var english = require('retext-english');
var sentiment = require('retext-sentiment');

var processor = unified()
  .use(english)
  .use(sentiment);

var file = vfile.readSync('example.txt');
var tree = processor.parse(file);

processor.run(tree, file);

console.log(inspect(tree));
```

Note that we’re not using [`.process()`][process], as that would not give
access to our tree.

Now, running `node example` yields (abbreviated):

```text
RootNode[6] (1:1-7:1, 0-135) [data={"polarity":5,"valence":"positive"}]
├─ ParagraphNode[1] (1:1-2:42, 0-87) [data={"polarity":-3,"valence":"negative"}]
│  └─ SentenceNode[32] (1:1-2:42, 0-87) [data={"polarity":-3,"valence":"negative"}]
│     ├─ WordNode[1] (1:1-1:2, 0-1)
│     │  └─ TextNode: "I" (1:1-1:2, 0-1)
│     ├─ WhiteSpaceNode: " " (1:2-1:3, 1-2)
│     ├─ WordNode[1] (1:3-1:7, 2-6) [data={"polarity":-3,"valence":"negative"}]
│     │  └─ TextNode: "hate" (1:3-1:7, 2-6) [data={"polarity":-3,"valence":"negative"}]
│     ├─ WhiteSpaceNode: " " (1:7-1:8, 6-7)
│     ...
│     └─ PunctuationNode: "." (2:41-2:42, 86-87)
├─ WhiteSpaceNode: "\n\n" (2:42-4:1, 87-89)
├─ ParagraphNode[1] (4:1-4:32, 89-120) [data={"polarity":3,"valence":"positive"}]
│  └─ SentenceNode[14] (4:1-4:32, 89-120) [data={"polarity":3,"valence":"positive"}]
│     ├─ WordNode[1] (4:1-4:5, 89-93)
│     │  └─ TextNode: "This" (4:1-4:5, 89-93)
│     ...
│     ├─ WordNode[1] (4:17-4:20, 105-108)
│     │  └─ TextNode: "not" (4:17-4:20, 105-108)
│     ├─ WhiteSpaceNode: " " (4:20-4:21, 108-109)
│     ├─ WordNode[1] (4:21-4:24, 109-112) [data={"polarity":-3,"valence":"negative"}]
│     │  └─ TextNode: "bad" (4:21-4:24, 109-112) [data={"polarity":-3,"valence":"negative"}]
│     ├─ WhiteSpaceNode: " " (4:24-4:25, 112-113)
│     ...
│     └─ PunctuationNode: "." (4:31-4:32, 119-120)
├─ WhiteSpaceNode: "\n\n" (4:32-6:1, 120-122)
├─ ParagraphNode[1] (6:1-6:13, 122-134) [data={"polarity":5,"valence":"positive"}]
│  └─ SentenceNode[6] (6:1-6:13, 122-134) [data={"polarity":5,"valence":"positive"}]
│     ├─ WordNode[1] (6:1-6:4, 122-125)
│     │  └─ TextNode: "Hai" (6:1-6:4, 122-125)
│     ├─ WhiteSpaceNode: " " (6:4-6:5, 125-126)
│     ├─ WordNode[1] (6:5-6:9, 126-130) [data={"polarity":3,"valence":"positive"}]
│     │  └─ TextNode: "sexy" (6:5-6:9, 126-130) [data={"polarity":3,"valence":"positive"}]
│     ├─ PunctuationNode: "!" (6:9-6:10, 130-131)
│     ├─ WhiteSpaceNode: " " (6:10-6:11, 131-132)
│     └─ SymbolNode: "😏" (6:11-6:13, 132-134) [data={"polarity":2,"valence":"positive"}]
└─ WhiteSpaceNode: "\n" (6:13-7:1, 134-135)
```

## API

### `retext().use(sentiment[, options])`

**retext-sentiment** automatically detects the sentiment of each
[`Text`][text] / [`WordNode`][word] (using [`afinn-165`][afinn]
and [`emoji-emotion`][emoticon]), and stores the valence in
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

**retext-sentiment** supports all [`afinn-165`][afinn] words
and [`emoji-emotion`][emoticon] emoji / gemoji.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-sentiment.svg

[travis]: https://travis-ci.org/wooorm/retext-sentiment

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-sentiment.svg

[codecov]: https://codecov.io/github/wooorm/retext-sentiment

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[text]: https://github.com/syntax-tree/nlcst#textnode

[word]: https://github.com/syntax-tree/nlcst#word

[afinn]: https://github.com/wooorm/afinn-165

[emoticon]: https://github.com/wooorm/emoji-emotion

[process]: https://github.com/unifiedjs/unified#processorprocessfilevalue-done
