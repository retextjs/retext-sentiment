'use strict';

/**
 * Dependencies.
 */

var afinn,
    emojiEmotion,
    gemoji,
    fs;

afinn = require('afinn-111');
emojiEmotion = require('emoji-emotion');
gemoji = require('gemoji');
fs = require('fs');

/**
 * Data.
 */

var list;

list = {};

/**
 * Add `afinn`.
 */

Object.keys(afinn).sort().forEach(function (key) {
    list[key] = afinn[key];
});

/**
 * Add `emoji-emotion` as unicode emoji.
 */

emojiEmotion.forEach(function (info) {
    list[info.emoji] = info.polarity;
});

/**
 * Add `emoji-emotion` as gemoji.
 */

emojiEmotion.forEach(function (info) {
    list[':' + gemoji.unicode[info.emoji].name + ':'] = info.polarity;
});

/**
 * Write.
 */

fs.writeFileSync('data/data.json', JSON.stringify(list, null, 2) + '\n');
