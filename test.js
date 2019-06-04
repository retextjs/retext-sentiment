'use strict'

var test = require('tape')
var retext = require('retext')
var u = require('unist-builder')
var remove = require('unist-util-remove-position')
var sentiment = require('.')

test('sentiment()', function(t) {
  var processor = retext().use(sentiment, {cats: -3, dogs: 3})
  var tree = processor.runSync(
    processor.parse(
      'Some positive, happy, cats. ' +
        'Darn self-deluded, abandoned, dogs. ' +
        'Home Sweet Home Chicago! ' +
        'Feels good to be back. ' +
        'Bad news though. ' +
        'This product is not bad at all. ' +
        'Hai sexy! 😏'
    )
  )

  remove(tree, true)

  t.deepEqual(
    tree,
    u('RootNode', {data: {polarity: 12, valence: 'positive'}}, [
      u('ParagraphNode', {data: {polarity: 12, valence: 'positive'}}, [
        u('SentenceNode', {data: {polarity: 2, valence: 'positive'}}, [
          u('WordNode', [u('TextNode', 'Some')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: 2, valence: 'positive'}}, [
            u(
              'TextNode',
              {data: {polarity: 2, valence: 'positive'}},
              'positive'
            )
          ]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: 3, valence: 'positive'}}, [
            u('TextNode', {data: {polarity: 3, valence: 'positive'}}, 'happy')
          ]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: -3, valence: 'negative'}}, [
            u('TextNode', {data: {polarity: -3, valence: 'negative'}}, 'cats')
          ]),
          u('PunctuationNode', '.')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: -1, valence: 'negative'}}, [
          u('WordNode', [u('TextNode', 'Darn')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: -2, valence: 'negative'}}, [
            u('TextNode', 'self'),
            u('PunctuationNode', '-'),
            u('TextNode', 'deluded')
          ]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: -2, valence: 'negative'}}, [
            u(
              'TextNode',
              {data: {polarity: -2, valence: 'negative'}},
              'abandoned'
            )
          ]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: 3, valence: 'positive'}}, [
            u('TextNode', {data: {polarity: 3, valence: 'positive'}}, 'dogs')
          ]),
          u('PunctuationNode', '.')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: 0, valence: 'neutral'}}, [
          u('WordNode', [u('TextNode', 'Home')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'Sweet')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'Home')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'Chicago')]),
          u('PunctuationNode', '!')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: 3, valence: 'positive'}}, [
          u('WordNode', [u('TextNode', 'Feels')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: 3, valence: 'positive'}}, [
            u('TextNode', {data: {polarity: 3, valence: 'positive'}}, 'good')
          ]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'to')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'be')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'back')]),
          u('PunctuationNode', '.')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: 0, valence: 'neutral'}}, [
          u('WordNode', [u('TextNode', 'Bad')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'news')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'though')]),
          u('PunctuationNode', '.')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: 3, valence: 'positive'}}, [
          u('WordNode', [u('TextNode', 'This')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'product')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'is')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'not')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: -3, valence: 'negative'}}, [
            u('TextNode', {data: {polarity: -3, valence: 'negative'}}, 'bad')
          ]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'at')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'all')]),
          u('PunctuationNode', '.')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', {data: {polarity: 5, valence: 'positive'}}, [
          u('WordNode', [u('TextNode', 'Hai')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', {data: {polarity: 3, valence: 'positive'}}, [
            u('TextNode', {data: {polarity: 3, valence: 'positive'}}, 'sexy')
          ]),
          u('PunctuationNode', '!'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', {data: {polarity: 2, valence: 'positive'}}, '😏')
        ])
      ])
    ])
  )

  t.end()
})
