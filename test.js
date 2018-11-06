'use strict'

var test = require('tape')
var visit = require('unist-util-visit')
var retext = require('retext')
var sentiment = require('.')

var fixture =
  'Some positive, happy, cats. ' +
  'Darn self-deluded, abandoned, dogs. ' +
  'Home Sweet Home Chicago! ' +
  'Feels good to be back. ' +
  'Bad news though. ' +
  'This product is not bad at all. ' +
  'Hai sexy! \uD83D\uDE0F'

var inject = {
  cats: -3,
  dogs: 3
}

var wordValence = [
  undefined,
  'positive',
  'positive',
  'negative',
  undefined,
  'negative',
  'negative',
  'positive',
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  'positive',
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  'negative',
  undefined,
  undefined,
  undefined,
  'positive'
]

var wordPolarities = [
  undefined,
  2,
  3,
  -3,
  undefined,
  -2,
  -2,
  3,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  3,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  -3,
  undefined,
  undefined,
  undefined,
  3
]

var sentenceValences = [
  'positive',
  'negative',
  'neutral',
  'positive',
  'neutral',
  'positive',
  'positive'
]

var sentencePolarities = [2, -1, 0, 3, 0, 3, 5]

test('sentiment()', function(t) {
  var processor = retext().use(sentiment, inject)
  var tree = processor.parse(fixture)
  var index = -1

  processor.runSync(tree)

  visit(tree, 'WordNode', function(node) {
    var data = node.data || {}

    index++

    t.equal(data.valence, wordValence[index])
    t.equal(data.polarity, wordPolarities[index])
  })

  index = -1

  visit(tree, 'SentenceNode', function(node) {
    index++

    t.equal(node.data.valence, sentenceValences[index])
    t.equal(node.data.polarity, sentencePolarities[index])
  })

  t.equal(tree.children[0].data.valence, 'positive')
  t.equal(tree.children[0].data.polarity, 12)
  t.equal(tree.data.valence, 'positive')
  t.equal(tree.data.polarity, 12)

  t.end()
})
