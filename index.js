import {afinn165} from 'afinn-165'
import {emojiEmotion} from 'emoji-emotion'
import {emoticon} from 'emoticon'
import {emojiToName} from 'gemoji'
import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'

var own = {}.hasOwnProperty

const map = {}
let key

for (key in afinn165) {
  if (own.call(afinn165, key)) {
    map[key] = afinn165[key]
  }
}

let index = -1

while (++index < emojiEmotion.length) {
  const {emoji, polarity} = emojiEmotion[index]
  map[emoji] = polarity
  map[':' + emojiToName[emoji] + ':'] = polarity
}

index = -1

while (++index < emoticon.length) {
  const {emoji, emoticons} = emoticon[index]
  let offset = -1

  if (emoji in map) {
    while (++offset < emoticons.length) {
      map[emoticons[offset]] = map[emoji]
    }
  }
}

var neutral = 'neutral'
var positive = 'positive'
var negative = 'negative'

// Patch `polarity` and `valence` properties on nodes with a value and word
// nodes.
// Then, patch the same properties on their parents.
export default function retextSentiment(options) {
  return transformer

  function transformer(node) {
    var concatenate = concatenateFactory()

    visit(node, any(options))
    visit(node, concatenate)

    concatenate.done()
  }
}

// Factory to gather parents and patch them based on their childrens sentiment.
function concatenateFactory() {
  var queue = []

  concatenate.done = done

  return concatenate

  // Gather a parent if not already gathered.
  function concatenate(_, _1, parent) {
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
    var negated = false

    while (++index < length) {
      child = children[index]

      if (child.data && child.data.polarity) {
        polarity += (negated ? -1 : 1) * child.data.polarity
      }

      // If the value is a word, remove any present negation.
      // Otherwise, add negation if the node contains it.
      if (child.type === 'WordNode') {
        if (negated) {
          negated = false
        } else if (negation(child)) {
          negated = true
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
      value = toString(node)

      if (config && own.call(config, value)) {
        polarity = config[value]
      } else if (own.call(map, value)) {
        polarity = map[value]
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
function negation(node) {
  var value = toString(node).toLowerCase()

  return (
    value === 'not' ||
    value === 'neither' ||
    value === 'nor' ||
    /n['’]t/.test(value)
  )
}

// Classify, from a given `polarity` between `-5` and `5`, if the polarity is
// negative, neutral, or positive.
function classify(polarity) {
  return polarity > 0 ? positive : polarity < 0 ? negative : neutral
}
