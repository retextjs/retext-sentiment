'use strict';

var afinn, visit, isOwnProperty, NEUTRAL, POSITIVE, NEGATIVE;

afinn = require('afinn-111');
visit = require('retext-visit');
isOwnProperty = Object.prototype.hasOwnProperty;

NEUTRAL = 'neutral';
POSITIVE = 'positive';
NEGATIVE = 'negative';

function classify(polarity) {
    return polarity > 0 ? POSITIVE : polarity < 0 ? NEGATIVE : NEUTRAL;
}

function onchangeinparent(parent, substract, add) {
    var polarity, data;

    if (!parent) {
        return;
    }

    data = parent.data;

    if (isOwnProperty.call(data, 'polarity')) {
        polarity = data.polarity;
    } else {
        polarity = 0;
    }

    polarity = polarity - substract + add;

    data.polarity = polarity;
    data.valence = classify(polarity);
    onchangeinparent(parent.parent, substract, add);
}

function onchange(node) {
    var data = node.data,
        polarity = 0,
        value = node.toString().toLowerCase();

    if (isOwnProperty.call(afinn, value)) {
        polarity = afinn[value];
    }

    data.polarity = polarity;
    data.valence = classify(polarity);
}

function onchangetext() {
    var self = this,
        previousPolarity = self.data.polarity;

    onchange(self);

    onchangeinparent(self.parent, previousPolarity, self.data.polarity);
}

function onremove(previousParent) {
    if (!('polarity' in this.data)) {
        return;
    }

    onchangeinparent(previousParent, this.data.polarity, 0);
}

function oninsert() {
    var self = this;

    if (self.type === self.WORD_NODE) {
        if (!('polarity' in self.data)) {
            onchange(self);
        }

        onchangeinparent(self.parent, 0, self.data.polarity);
    }
}

function plugin(tree) {
    tree.visitType(tree.SENTENCE_NODE, function (sentenceNode) {
        onchangeinparent(sentenceNode.parent, 0, sentenceNode.data.polarity);
    });
}

exports = module.exports = plugin;

function attach(retext) {
    var TextOM = retext.parser.TextOM;

    retext.use(visit);

    TextOM.WordNode.on('changetextinside', onchangetext);
    TextOM.WordNode.on('removeinside', onchangetext);
    TextOM.WordNode.on('insertinside', onchangetext);
    TextOM.Node.on('remove', onremove);
    TextOM.Node.on('insert', oninsert);
}

exports.attach = attach;
