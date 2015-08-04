/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:sentiment
 * @fileoverview Detect the sentiment of text with Retext.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');
var polarities = require('./data/data.json');

/*
 * Methods.
 */

var has = Object.prototype.hasOwnProperty;

/*
 * Constants.
 */

var NEUTRAL = 'neutral';
var POSITIVE = 'positive';
var NEGATIVE = 'negative';

/**
 * Classify, from a given `polarity` between `-5` and
 * `5`, if the polarity is `NEGATIVE` (negative),
 * `NEUTRAL` (0), or `POSITIVE` (positive).
 *
 * @param {number} polarity - Polarity to classify.
 * @return {string}
 */
function classify(polarity) {
    return polarity > 0 ? POSITIVE : polarity < 0 ? NEGATIVE : NEUTRAL;
}

/**
 * Detect if a value is used to negate something
 *
 * @param {Node} node - Node to check.
 * @return {boolean}
 */
function isNegation(node) {
    var value;

    value = nlcstToString(node).toLowerCase();

    if (
        value === 'not' ||
        value === 'neither' ||
        value === 'nor' ||
        /n['’]t/.test(value)
    ) {
        return true;
    }

    return false;
}

/**
 * Patch a `polarity` and valence property on `node`s.
 *
 * @param {NLCSTNode} node - Node.
 * @param {number} polarity - Positiveness or negativness.
 */
function patch(node, polarity) {
    var data = node.data || {};

    data.polarity = polarity || 0;
    data.valence = classify(polarity);

    node.data = data;
}

/**
 * Factory to patch absed on the bound `config`.
 *
 * @param {Object} config - Node.
 */
function any(config) {
    /**
     * Patch data-properties on `node`s with a value and words.
     *
     * @param {NLCSTNode} node - Node.
     */
    return function (node) {
        var value;
        var polarity;

        if ('value' in node || node.type === 'WordNode') {
            value = nlcstToString(node);

            if (config && has.call(config, value)) {
                polarity = config[value];
            } else if (has.call(polarities, value)) {
                polarity = polarities[value];
            }

            if (polarity) {
                patch(node, polarity);
            }
        }
    };
}

/**
 * Factory to gather parents and patch them based on their
 * childrens directionality.
 *
 * @return {function(node, index, parent)} - Can be passed
 *   to `visit`.
 */
function concatenateFactory() {
    var queue = [];

    /**
     * Gather a parent if not already gathered.
     *
     * @param {NLCSTWordNode} node - Word.
     * @param {number} index - Position of `node` in
     *   `parent`.
     * @param {NLCSTParentNode} parent - Parent of `child`.
     */
    function concatenate(node, index, parent) {
        if (
            parent &&
            parent.type !== 'WordNode' &&
            queue.indexOf(parent) === -1
        ) {
            queue.push(parent);
        }
    }

    /**
     * Patch all words in `parent`.
     *
     * @param {NLCSTParentNode} node - Parent
     */
    function one(node) {
        var children = node.children;
        var length = children.length;
        var polarity = 0;
        var index = -1;
        var child;
        var hasNegation;

        while (++index < length) {
            child = children[index];

            if (child.data && child.data.polarity) {
                polarity += (hasNegation ? -1 : 1) * child.data.polarity;
            }

            /*
             * If the value is a word, remove any present
             * negation. Otherwise, add negation if the
             * node contains it.
             */

            if (child.type === 'WordNode') {
                if (hasNegation) {
                    hasNegation = false;
                } else if (isNegation(child)) {
                    hasNegation = true;
                }
            }
        }

        patch(node, polarity);
    }

    /**
     * Patch all parents.
     */
    function done() {
        var length = queue.length;
        var index = -1;

        queue.reverse();

        while (++index < length) {
            one(queue[index]);
        }
    }

    concatenate.done = done;

    return concatenate;
}

/**
 * Define.
 *
 * @return {Function} - `transformer`.
 */
function attacher(retext, options) {
    /**
     * Patch `polarity` and `valence` properties on nodes
     * with a value and word-nodes. Then, patch the same
     * properties on their parents.
     *
     * @param {NLCSTNode} node - Syntax tree.
     */
    function transformer(node) {
        var concatenate = concatenateFactory();

        visit(node, any(options));
        visit(node, concatenate);

        concatenate.done();
    }

    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
