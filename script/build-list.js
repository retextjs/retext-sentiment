'use strict';

/* eslint-env node */

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var afinn = require('afinn-165');
var emojiEmotion = require('emoji-emotion');
var emoticons = require('emoticon');
var gemoji = require('gemoji');

/* Data. */
var list = {};

/* Add `afinn`. */
Object.keys(afinn).sort().forEach(function (key) {
  list[key] = afinn[key];
});

/* Add `emoji-emotion` as unicode emoji. */
emojiEmotion.forEach(function (info) {
  list[info.emoji] = info.polarity;
});

/* Add `emoji-emotion` as gemoji. */
emojiEmotion.forEach(function (info) {
  list[':' + gemoji.unicode[info.emoji].name + ':'] = info.polarity;
});

/* Add `emoji-emotion` as gemoji. */
emoticons.forEach(function (emoticon) {
  var emoji = emoticon.emoji;
  var subset = emoticon.emoticons;
  var length = subset.length;
  var index = -1;

  if (emoji in list) {
    while (++index < length) {
      list[subset[index]] = list[emoji];
    }
  }
});

/* Write. */
fs.writeFileSync(
  path.join('index.json'),
  JSON.stringify(list, null, 2) + '\n'
);
