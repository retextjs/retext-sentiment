'use strict'

var visit = require('unist-util-visit')
var nlcstToString = require('nlcst-to-string')
var polarities = require('./index.json')

module.exports = sentiment

var own = {}.hasOwnProperty

var neutral = 'neutral'
var positive = 'positive'
var negative = 'negative'

// Patch `polarity` and `valence` properties on nodes with a value and
// word-nodes.  Then, patch the same properties on their parents.
function sentiment(options) {
  return transformer

  function transformer(node) {
    var concatenate = concatenateFactory()

    visit(node, any(options))
    visit(node, concatenate)

    concatenate.done()
  }
}

// Factory to gather parents and patch them based on their childrens
// directionality.
function concatenateFactory() {
  var queue = []

  concatenate.done = done

  return concatenate

  // Gather a parent if not already gathered.
  function concatenate(node, index, parent) {
    if (parent && parent.type !== 'WordNode' && queue.indexOf(parent) === -1) {
      queue.push(parent)
    }
  }

  // Patch all words in `parent`.
  function one(node) {
    var children = node.children
    var length = children.length
    var polarity = 0
    var index = -1
    var child
    var hasNegation

    while (++index < length) {
      child = children[index]

      if (child.data && child.data.polarity) {
        polarity += (hasNegation ? -1 : 1) * child.data.polarity
      }

      // If the value is a word, remove any present negation.  Otherwise, add
      // negation if the node contains it.
      if (child.type === 'WordNode') {
        if (hasNegation) {
          hasNegation = false
        } else if (isNegation(child)) {
          hasNegation = true
        }
      }
    }

    patch(node, polarity)
  }

  // Patch all parents.
  function done() {
    var length = queue.length
    var index = -1

    queue.reverse()

    while (++index < length) {
      one(queue[index])
    }
  }
}

// Factory to patch based on the bound `config`.
function any(config) {
  return setter

  // Patch data-properties on `node`s with a value and words.
  function setter(node) {
    var value
    var polarity

    if ('value' in node || node.type === 'WordNode') {
      value = nlcstToString(node)

      if (config && own.call(config, value)) {
        polarity = config[value]
      } else if (own.call(polarities, value)) {
        polarity = polarities[value]
      }

      if (polarity) {
        patch(node, polarity)
      }
    }
  }
}

// Patch a `polarity` and valence property on `node`s.
function patch(node, polarity) {
  var data = node.data || {}

  data.polarity = polarity || 0
  data.valence = classify(polarity)

  node.data = data
}

// Detect if a value is used to negate something.
function isNegation(node) {
  var value

  value = nlcstToString(node).toLowerCase()

  if (
    value === 'not' ||
    value === 'neither' ||
    value === 'nor' ||
    /n['’]t/.test(value)
  ) {
    return true
  }

  return false
}

// Classify, from a given `polarity` between `-5` and `5`, if the polarity is
// negative, neutral, or positive.
function classify(polarity) {
  if (polarity > 0) {
    return positive
  }

  return polarity < 0 ? negative : neutral
}
