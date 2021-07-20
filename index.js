/**
 * @typedef {Record<string, number>} Options
 *   Mapping strings (words, other symbols) to numbers.
 *   Used to insert custom values or for overwriting existing values with new
 *   weights.
 */

import {afinn165} from 'afinn-165'
import {emojiEmotion} from 'emoji-emotion'
import {emoticon} from 'emoticon'
import {emojiToName} from 'gemoji'
import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

/** @type {Record<string, number>} */
const map = {}
/** @type {string} */
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
  // @ts-expect-error: it’s an index.
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

/**
 * Patch `polarity` and `valence` properties on nodes with a value and word
 * nodes.
 * Then, patch the same properties on their parents.
 *
 * @type {import('unified').Plugin<[Options?]>}
 */
export default function retextSentiment(options = {}) {
  /**
   * @typedef {import('unist').Node} Node
   * @typedef {import('unist').Parent} Parent
   */

  return (node) => {
    /** @type {Parent[]} */
    const queue = []

    // Patch data-properties on `node`s with a value and words.
    visit(node, (node) => {
      if ('value' in node || node.type === 'WordNode') {
        const value = toString(node)
        /** @type {number|undefined} */
        let polarity

        if (own.call(options, value)) {
          polarity = options[value]
        } else if (own.call(map, value)) {
          polarity = map[value]
        }

        if (polarity !== undefined) {
          patch(node, polarity)
        }
      }
    })

    // Gather a parent if not already gathered.
    visit(node, (_, _1, parent) => {
      if (parent && parent.type !== 'WordNode' && !queue.includes(parent)) {
        queue.push(parent)
      }
    })

    let index = -1

    queue.reverse()

    while (++index < queue.length) {
      // Patch all words in `parent`.
      const node = queue[index]
      const children = node.children
      let polarity = 0
      let offset = -1
      let negated = false

      while (++offset < children.length) {
        const child = children[offset]

        if (child.data && typeof child.data.polarity === 'number') {
          polarity += (negated ? -1 : 1) * child.data.polarity
        }

        // If the value is a word, remove any present negation.
        // Otherwise, add negation if the node contains it.
        if (child.type === 'WordNode') {
          // Detect if a value is used to negate something.
          const value = toString(child).toLowerCase()

          if (negated) {
            negated = false
          } else if (/^(not|neither|nor)$|n['’]t/.test(value)) {
            negated = true
          }
        }
      }

      patch(node, polarity)
    }
  }

  /**
   * Patch a `polarity` and valence property on `node`s.
   *
   * @param {Node} node
   * @param {number} polarity
   */
  function patch(node, polarity) {
    const data = node.data || (node.data = {})

    data.polarity = polarity
    // Classify, from a given `polarity` between `-5` and `5`, if the polarity is
    // negative, neutral, or positive.
    data.valence =
      polarity > 0 ? 'positive' : polarity < 0 ? 'negative' : 'neutral'
  }
}
