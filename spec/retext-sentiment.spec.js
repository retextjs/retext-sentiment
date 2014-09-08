'use strict';

var sentiment, content, visit, Retext, assert, tree,
    otherWords,
    valences, polarities,
    sentenceValences, sentencePolarities,
    paragraphValences, paragraphPolarities,
    otherValences, otherPolarities,
    otherSentenceValences, otherSentencePolarities,
    otherParagraphValences, otherParagraphPolarities;

sentiment = require('..');
content = require('retext-content');
Retext = require('retext');
visit = require('retext-visit');
assert = require('assert');

tree = new Retext()
    .use(content)
    .use(visit)
    .use(sentiment)
    .parse(
        'Some positive, happy, cats. ' +
        'Darn self-deluded, abandoned, dogs.\n' +
        'Home Sweet Home Chicago! ' +
        'Feels good to be back. ' +
        'Bad news though.'
    );

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

describe('sentiment()', function () {
    it('should be of type `function`', function () {
        assert(typeof sentiment === 'function');
    });

    it('should process each `WordNode`', function () {
        var iterator = -1;

        tree.visitType(tree.WORD_NODE, function (wordNode) {
            iterator++;

            assert(wordNode.data.valence === valences[iterator]);
            assert(wordNode.data.polarity === polarities[iterator]);
        });
    });

    it('should process each `SentenceNode`', function () {
        var iterator = -1;

        tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
            iterator++;

            assert(
                sentenceNode.data.valence === sentenceValences[iterator]
            );
            assert(
                sentenceNode.data.polarity === sentencePolarities[iterator]
            );
        });
    });

    it('should process each `ParagraphNode`', function () {
        var iterator = -1;

        tree.visitType(tree.PARAGRAPH_NODE, function (paragraphNode) {
            iterator++;

            assert(
                paragraphNode.data.valence === paragraphValences[iterator]
            );
            assert(
                paragraphNode.data.polarity === paragraphPolarities[iterator]
            );
        });
    });

    it('should process the `RootNode`', function () {
        assert(tree.data.valence === 'positive');
        assert(tree.data.polarity === 3);
    });

    it('should set `polarity` to `0` and `valence` to `neutral` when a ' +
        'word no longer has a value', function () {
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode.removeContent();
                assert(wordNode.data.valence === 'neutral');
                assert(wordNode.data.polarity === 0);
            });
        }
    );

    it('should set `polarity` to `0` and `valence` to `neutral` when ' +
        'a sentence no longer has values', function () {
            tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
                assert(sentenceNode.data.valence === 'neutral');
                assert(sentenceNode.data.polarity === 0);
            });
        }
    );

    it('should set `polarity` to `0` and `valence` to `neutral` when ' +
        'a paragraph no longer has values', function () {
            tree.visitType(tree.PARAGRAPH_NODE, function (paragraphNode) {
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

    it('should automatically reprocess a word when its value changes',
        function () {
            var iterator = -1;

            tree.visitType(tree.WORD_NODE, function (wordNode) {
                iterator++;

                wordNode.replaceContent(otherWords[iterator]);

                assert(wordNode.data.valence === otherValences[iterator]);
                assert(wordNode.data.polarity === otherPolarities[iterator]);
            });
        }
    );

    it('should automatically reprocess a sentence when its values change',
        function () {
            var iterator = -1;

            tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
                iterator++;

                assert(
                    sentenceNode.data.valence ===
                    otherSentenceValences[iterator]
                );
                assert(
                    sentenceNode.data.polarity ===
                    otherSentencePolarities[iterator]
                );
            });
        }
    );

    it('should automatically reprocess a paragraph when its values change',
        function () {
            var iterator = -1;

            tree.visitType(tree.PARAGRAPH_NODE, function (paragraphNode) {
                iterator++;

                assert(
                    paragraphNode.data.valence ===
                    otherParagraphValences[iterator]
                );
                assert(
                    paragraphNode.data.polarity ===
                    otherParagraphPolarities[iterator]
                );
            });
        }
    );

    it('should automatically reprocess a root when its values change',
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
