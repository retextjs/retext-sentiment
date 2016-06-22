'use strict';

/* eslint-env node */

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var afinn = require('afinn-111');
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
emojiEmotion.forEach(function (info) {
    if (info.emoji in emoticons.unicode) {
        emoticons.unicode[info.emoji].emoticons.forEach(function (emoticon) {
            list[emoticon] = info.polarity;
        });
    }
});

/* Write. */
fs.writeFileSync(
    path.join('index.json'),
    JSON.stringify(list, null, 2) + '\n'
);
