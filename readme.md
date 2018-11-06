# retext-sentiment [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

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
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var inspect = require('unist-util-inspect')
var unified = require('unified')
var english = require('retext-english')
var sentiment = require('retext-sentiment')

var processor = unified()
  .use(english)
  .use(sentiment)

var file = vfile.readSync('example.txt')
var tree = processor.parse(file)

processor.run(tree, file)

console.log(inspect(tree))
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

`retext-sentiment` automatically detects the sentiment of each
[`Text`][text] / [`Word`][word] (using [`afinn-165`][afinn]
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

###### `options.inject`

Overwrites (`Object`, optional).

Mapping strings (words, other symbols) to numbers.  Used to insert custom
values, or overwrite existing values with new weights.

## Support

`retext-sentiment` supports all [`afinn-165`][afinn] words and
[`emoji-emotion`][emoticon] emoji / gemoji.

## Contribute

See [`contributing.md` in `retextjs/retext`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-sentiment.svg

[build]: https://travis-ci.org/retextjs/retext-sentiment

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-sentiment.svg

[coverage]: https://codecov.io/github/retextjs/retext-sentiment

[downloads-badge]: https://img.shields.io/npm/dm/retext-sentiment.svg

[downloads]: https://www.npmjs.com/package/retext-sentiment

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[text]: https://github.com/syntax-tree/nlcst#text

[word]: https://github.com/syntax-tree/nlcst#word

[afinn]: https://github.com/words/afinn-165

[emoticon]: https://github.com/words/emoji-emotion

[process]: https://github.com/unifiedjs/unified#processorprocessfilevalue-done

[contributing]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
