'use strict';

var sentiment,
    inspect,
    content,
    visit,
    Retext,
    assert;

/**
 * Dependencies.
 */

sentiment = require('./');
inspect = require('retext-inspect');
content = require('retext-content');
Retext = require('retext');
visit = require('retext-visit');
assert = require('assert');

/**
 * Retext.
 */

var retext;

retext = new Retext()
    .use(inspect)
    .use(content)
    .use(visit)
    .use(sentiment);

/**
 * Fixtures
 */

var fixture,
    otherWords,
    valences,
    polarities,
    sentenceValences,
    sentencePolarities,
    paragraphValences,
    paragraphPolarities,
    otherValences,
    otherPolarities,
    otherSentenceValences,
    otherSentencePolarities,
    otherParagraphValences,
    otherParagraphPolarities;

fixture =
    'Some positive, happy, cats. ' +
    'Darn self-deluded, abandoned, dogs.\n' +
    'Home Sweet Home Chicago! ' +
    'Feels good to be back. ' +
    'Bad news though.';

valences = [
    'neutral', 'positive', 'positive', 'neutral',
    'neutral', 'negative', 'negative', 'neutral',
    'neutral', 'positive', 'neutral', 'neutral',
    'neutral', 'positive', 'neutral', 'neutral', 'neutral',
    'negative', 'neutral', 'neutral'
];

polarities = [
    0, 2, 3, 0,
    0, -2, -2, 0,
    0, 2, 0, 0,
    0, 3, 0, 0, 0,
    -3, 0, 0
];

sentenceValences = [
    'positive', 'negative',
    'positive', 'positive', 'negative'
];

sentencePolarities = [5, -4, 2, 3, -3];

paragraphValences = ['positive', 'positive'];

paragraphPolarities = [1, 2];

otherWords = [
    'Hate', 'to', 'wait', 'somewhere',
    'I', 'still', 'feel', 'alone',
    'I', 'hate', 'forgetting', 'book',
    'sad', 'you', 'want', 'to', 'sleep',
    'never', 'how', 'sad'
];

otherValences = [
    'negative', 'neutral', 'neutral', 'neutral',
    'neutral', 'neutral', 'neutral', 'negative',
    'neutral', 'negative', 'neutral', 'neutral',
    'negative', 'neutral', 'positive', 'neutral', 'neutral',
    'neutral', 'neutral', 'negative'
];

otherPolarities = [
    -3, 0, 0, 0,
    0, 0, 0, -2,
    0, -3, 0, 0,
    -2, 0, 1, 0, 0,
    0, 0, -2
];

otherSentenceValences = [
    'negative', 'negative', 'negative', 'negative', 'negative'
];

otherSentencePolarities = [-3, -2, -3, -1, -2];

otherParagraphValences = ['negative', 'negative'];

otherParagraphPolarities = [-5, -6];

/**
 * Tests.
 */

describe('sentiment()', function () {
    var tree;

    before(function (done) {
        retext.parse(fixture, function (err, node) {
            tree = node;

            done(err);
        });
    });

    it('should be a `function`', function () {
        assert(typeof sentiment === 'function');
    });

    it('should process each `WordNode`', function () {
        var index = -1;

        tree.visit(tree.WORD_NODE, function (wordNode) {
            index++;

            assert(wordNode.data.valence === valences[index]);
            assert(wordNode.data.polarity === polarities[index]);
        });
    });

    it('should process each `SentenceNode`', function () {
        var index = -1;

        tree.visit(tree.SENTENCE_NODE, function (sentenceNode) {
            index++;

            assert(
                sentenceNode.data.valence === sentenceValences[index]
            );
            assert(
                sentenceNode.data.polarity === sentencePolarities[index]
            );
        });
    });

    it('should process each `ParagraphNode`', function () {
        var index = -1;

        tree.visit(tree.PARAGRAPH_NODE, function (paragraphNode) {
            index++;

            assert(
                paragraphNode.data.valence === paragraphValences[index]
            );
            assert(
                paragraphNode.data.polarity === paragraphPolarities[index]
            );
        });
    });

    it('should process the `RootNode`', function () {
        assert(tree.data.valence === 'positive');
        assert(tree.data.polarity === 3);
    });

    it('should set `polarity` to `0` and `valence` to `neutral` when a ' +
        'word no longer has a value', function () {
            tree.visit(tree.WORD_NODE, function (wordNode) {
                wordNode.removeContent();
                assert(wordNode.data.valence === 'neutral');
                assert(wordNode.data.polarity === 0);
            });
        }
    );

    it('should set `polarity` to `0` and `valence` to `neutral` when ' +
        'a sentence no longer has values', function () {
            tree.visit(tree.SENTENCE_NODE, function (sentenceNode) {
                assert(sentenceNode.data.valence === 'neutral');
                assert(sentenceNode.data.polarity === 0);
            });
        }
    );

    it('should set `polarity` to `0` and `valence` to `neutral` when ' +
        'a paragraph no longer has values', function () {
            tree.visit(tree.PARAGRAPH_NODE, function (paragraphNode) {
                assert(paragraphNode.data.valence === 'neutral');
                assert(paragraphNode.data.polarity === 0);
            });
        }
    );

    it('should set `polarity` to `0` and `valence` to `neutral` when ' +
        'a root no longer has values', function () {
            assert(tree.data.valence === 'neutral');
            assert(tree.data.polarity === 0);
        }
    );

    it('should re-process a word when its value changes',
        function () {
            var index = -1;

            tree.visit(tree.WORD_NODE, function (wordNode) {
                index++;

                wordNode.replaceContent(otherWords[index]);

                assert(wordNode.data.valence === otherValences[index]);
                assert(wordNode.data.polarity === otherPolarities[index]);
            });
        }
    );

    it('should re-process a sentence when its values change',
        function () {
            var index = -1;

            tree.visit(tree.SENTENCE_NODE, function (sentenceNode) {
                index++;

                assert(
                    sentenceNode.data.valence ===
                    otherSentenceValences[index]
                );
                assert(
                    sentenceNode.data.polarity ===
                    otherSentencePolarities[index]
                );
            });
        }
    );

    it('should re-process a paragraph when its values change',
        function () {
            var index = -1;

            tree.visit(tree.PARAGRAPH_NODE, function (paragraphNode) {
                index++;

                assert(
                    paragraphNode.data.valence ===
                    otherParagraphValences[index]
                );
                assert(
                    paragraphNode.data.polarity ===
                    otherParagraphPolarities[index]
                );
            });
        }
    );

    it('should re-process a root when its values change',
        function () {
            assert(tree.data.valence === 'negative');
            assert(tree.data.polarity === -11);
        }
    );

    it('should not fail when a node without valence is removed',
        function () {
            var headSentence = tree.head.head;
            headSentence.remove();
        }
    );

    it('should not fail when a word without valence is inserted',
        function () {
            tree.head.tail.append(new tree.TextOM.WordNode());
        }
    );
});
