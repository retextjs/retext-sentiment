'use strict'

var fs = require('fs')
var afinn = require('afinn-165')
var emojiEmotion = require('emoji-emotion')
var emoticons = require('emoticon')
var emoji2gemoji = require('gemoji/emoji-to-name')

var list = {}

Object.keys(afinn)
  .sort()
  .forEach(function (key) {
    list[key] = afinn[key]
  })

emojiEmotion.forEach(function (info) {
  list[info.emoji] = info.polarity
})

emojiEmotion.forEach(function (info) {
  list[':' + emoji2gemoji[info.emoji] + ':'] = info.polarity
})

emoticons.forEach(function (emoticon) {
  var emoji = emoticon.emoji
  var subset = emoticon.emoticons
  var length = subset.length
  var index = -1

  if (emoji in list) {
    while (++index < length) {
      list[subset[index]] = list[emoji]
    }
  }
})

fs.writeFileSync('index.json', JSON.stringify(list, null, 2) + '\n')
