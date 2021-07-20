import fs from 'fs'
import {afinn165} from 'afinn-165'
import {emojiEmotion} from 'emoji-emotion'
import {emoticon} from 'emoticon'
import {emojiToName} from 'gemoji'

var list = {}

Object.keys(afinn165)
  .sort()
  .forEach(function (key) {
    list[key] = afinn165[key]
  })

emojiEmotion.forEach(function (info) {
  list[info.emoji] = info.polarity
})

emojiEmotion.forEach(function (info) {
  list[':' + emojiToName[info.emoji] + ':'] = info.polarity
})

emoticon.forEach(function (d) {
  var emoji = d.emoji
  var subset = d.emoticons
  var length = subset.length
  var index = -1

  if (emoji in list) {
    while (++index < length) {
      list[subset[index]] = list[emoji]
    }
  }
})

fs.writeFileSync(
  'list.js',
  'export const list = ' + JSON.stringify(list, null, 2) + '\n'
)
