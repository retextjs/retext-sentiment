'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var visit = require('unist-util-visit');
var sentiment = require('./');

/*
 * Methods.
 */

var equal = assert.equal;

/*
 * Fixtures.
 */

var fixture =
    'Some positive, happy, cats. ' +
    'Darn self-deluded, abandoned, dogs. ' +
    'Home Sweet Home Chicago! ' +
    'Feels good to be back. ' +
    'Bad news though. ' +
    'This product is not bad at all. ' +
    'Hai sexy! \ud83d\ude0f';

var inject = {
    'cats': -3,
    'dogs': 3
};

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
];

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
];

var sentenceValences = [
    'positive',
    'negative',
    'neutral',
    'positive',
    'neutral',
    'positive',
    'positive'
];

var sentencePolarities = [
    2,
    -1,
    0,
    3,
    0,
    3,
    6
];

/*
 * Tests.
 */

describe('sentiment()', function () {
    var tree;

    before(function (done) {
        retext.use(sentiment, inject).process(fixture, function (err, file) {
            tree = file.namespace('retext').cst;

            done(err);
        });
    });

    it('should work', function () {
        var index = -1;

        visit(tree, 'WordNode', function (node) {
            var data = node.data || {};

            index++;

            equal(data.valence, wordValence[index]);
            equal(data.polarity, wordPolarities[index]);
        });

        index = -1;

        visit(tree, 'SentenceNode', function (node) {
            index++;

            equal(node.data.valence, sentenceValences[index]);
            equal(node.data.polarity, sentencePolarities[index]);
        });

        equal(tree.children[0].data.valence, 'positive');
        equal(tree.children[0].data.polarity, 13);
        equal(tree.data.valence, 'positive');
        equal(tree.data.polarity, 13);
    });
});
