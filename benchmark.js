'use strict';

var Retext,
    sentiment,
    gemoji;

/**
 * Dependencies.
 */

Retext = require('retext');
gemoji = require('gemoji');
sentiment = require('./');

/**
 * Dependencies.
 */

var retext,
    retextWithSentiment;

retext = new Retext();
retextWithSentiment = new Retext().use(sentiment);

/**
 * Fixtures.
 *
 * Source:
 *   http://www.gutenberg.org/cache/epub/11024/pg11024.html
 */

var paragraph,
    sentimentParagraph;

/**
 * A paragraph, 5 sentences, filled with 10 emojis.
 */

sentimentParagraph = 'Thou art a weird knight to so ' +
    'hate a woman. He could not shit upon his ' +
    'horse any longer. ' +

    'For methinks something hath befallen my :3 ' +
    'and that he then, after a while, he cried out in ' +
    'great voice.' +

    'For that sunny in the ' +
    'sky lieth in the south then Queen Helen fell down ' +
    'in a swoon, and :sleeping:. ' +

    'Touch me not, for I am not mortal, but o:) so the ' +
    'Lady of the Lake zapped away, everything behind. ' +

    'Where :princess: had stood was clear, and she was ' +
    'gone since ' + gemoji.name.man.emoji + ' does not ' +
    'choose to assume my fight.';

/**
 * A paragraph, 5 sentences, without emojis.
 */

paragraph = 'Thou art a churlish knight to so affront ' +
    'a lady he could not sit upon his horse any ' +
    'longer. ' +

    'For methinks something hath befallen my lord and ' +
    'that he then, after a while, he smurfed out in ' +
    'smurfing voice. ' +

    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and lay. ' +

    'Touch me not, for I am not mortal, but Fay so ' +
    'the Lady of the Lake vanished away, everything ' +
    'behind. ' +

    'Where she had stood was smurf, and she was gone ' +
    'since Sir Kay does not choose to assume my quarrel.';

/**
 * Benchmark.
 */

suite('retext w/o retext-sentiment', function () {
    bench('A paragraph (5 sentences, 100 words, lots of sentiment)',
        function (done) {
            retext.parse(sentimentParagraph, done);
        }
    );

    bench('A paragraph (5 sentences, 100 words, no sentiment)',
        function (done) {
            retext.parse(paragraph, done);
        }
    );
});

suite('retext w/ retext-sentiment', function () {
    bench('A paragraph (5 sentences, 100 words, lots of sentiment)',
        function (done) {
            retextWithSentiment.parse(sentimentParagraph, done);
        }
    );

    bench('A paragraph (5 sentences, 100 words, no sentiment)',
        function (done) {
            retextWithSentiment.parse(paragraph, done);
        }
    );
});
