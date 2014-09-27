'use strict';

/**
 * Dependencies.
 */

var afinn,
    visit;

afinn = require('afinn-111');
visit = require('retext-visit');

/**
 * Constants.
 */

var has,
    NEUTRAL,
    POSITIVE,
    NEGATIVE;

has = Object.prototype.hasOwnProperty;

NEUTRAL = 'neutral';
POSITIVE = 'positive';
NEGATIVE = 'negative';

/**
 * Classify, from a given `polarity` between `-5` and
 * `5`, if the polarity is `NEGATIVE` (negative),
 * `NEUTRAL` (0), or `POSITIVE` (positive).
 *
 * @param {number} polarity
 * @return {string}
 */

function classify(polarity) {
    return polarity > 0 ? POSITIVE : polarity < 0 ? NEGATIVE : NEUTRAL;
}

/**
 * Handler for a polarity change in a `parent`.
 *
 * @param {Parent} parent
 * @param {number} substract - Ammount subtract.
 * @param {number} add - Ammount add.
 */

function onchangeinparent(parent, substract, add) {
    var polarity,
        data;

    if (!parent) {
        return;
    }

    data = parent.data;

    if (has.call(data, 'polarity')) {
        polarity = data.polarity;
    } else {
        polarity = 0;
    }

    polarity = polarity - substract + add;

    data.polarity = polarity;
    data.valence = classify(polarity);

    onchangeinparent(parent.parent, substract, add);
}

/**
 * Handler for a value change in a `node`.
 *
 * @param {WordNode} node
 */

function onchange(node) {
    var data,
        polarity,
        value;

    data = node.data;
    polarity = 0;
    value = node.toString().toLowerCase();

    if (has.call(afinn, value)) {
        polarity = afinn[value];
    }

    data.polarity = polarity;
    data.valence = classify(polarity);
}

/**
 * Handler for a value change in an attached word.
 *
 * @this {WordNode}
 */

function onchangetext() {
    var self,
        previousPolarity;

    self = this;
    previousPolarity = self.data.polarity;

    onchange(self);

    onchangeinparent(self.parent, previousPolarity, self.data.polarity);
}

/**
 * Handler for a node's deletion.
 *
 * @param {Parent} previousParent
 * @this {WordNode}
 */

function onremove(previousParent) {
    if (!has.call(this.data, 'polarity')) {
        return;
    }

    onchangeinparent(previousParent, this.data.polarity, 0);
}

/**
 * Handler for a node's insertion.
 *
 * @this {WordNode}
 */

function oninsert() {
    var self = this;

    if (!has.call(self.data, 'polarity')) {
        onchange(self);
    }

    onchangeinparent(self.parent, 0, self.data.polarity);
}

/**
 * Define `sentiment`.
 *
 * @param {Node} tree
 */

function sentiment(tree) {
    tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
        onchangeinparent(sentenceNode.parent, 0, sentenceNode.data.polarity);
    });
}

/**
 * Define `attach`.
 *
 * @param {Retext} retext
 */

function attach(retext) {
    var TextOM;

    TextOM = retext.TextOM;

    retext.use(visit);

    TextOM.WordNode.on('changetextinside', onchangetext);
    TextOM.WordNode.on('removeinside', onchangetext);
    TextOM.WordNode.on('insertinside', onchangetext);
    TextOM.WordNode.on('insert', oninsert);
    TextOM.Node.on('remove', onremove);
}

/**
 * Expose `attach`.
 */

sentiment.attach = attach;

/**
 * Expose `sentiment`.
 */

module.exports = sentiment;
