/*
    ./options/dom.js

    The dom option; provides value gathering from supplied selectors
*/
msngr.extend((function(external, internal) {
    "use strict";

    internal.option("dom", function(message, payload, options, async) {
        // Normalize all of the inputs
        options = options || {};
        options = options.dom || {};
        var doc = options.doc || options.document || document;

        var selectors = undefined;
        if (external.isObject(options) && external.exist(options.selectors) && external.isString(options.selectors)) {
            selectors = [options.selectors];
        } else if (external.isString(options)) {
            selectors = [options];
        } else if (external.isArray(options)) {
            selectors = options;
        }

        if (!external.exist(doc) || !external.exist(selectors) || selectors.length === 0) {
            return undefined;
        }

        // Process all selectors and put them into a single array
        var elements = [];
        var selLength = selectors.length;
        for (var i = 0; i < selLength; ++i) {
            var found = external.findElements(selectors[i], doc);
            if (found.length > 0) {
                elements = elements.concat(Array.prototype.slice.call(found));
            }
        }

        // Short circuit because no elements
        if (elements.length === 0) {
            return undefined;
        }

        // Iterate through found elements and aggregate the results
        var resultMap = undefined;
        var elmLength = elements.length;
        var unnamedTags = 0;
        for (var i = 0; i < elmLength; ++i) {
            var key = undefined, value = undefined;
            var elm = elements[i];

            var nameAttr = elm.getAttribute("name");
            var idAttr = elm.id;
            var tagName = elm.tagName.toLowerCase();
            var val = elm.value;

            if (external.exist(nameAttr) && !external.isEmptyString(nameAttr)) {
                key = nameAttr;
            } else if (external.exist(idAttr) && !external.isEmptyString(idAttr)) {
                key = idAttr;
            } else {
                key = (tagName + unnamedTags);
                unnamedTags++;
            }

            if (resultMap === undefined) {
                resultMap = {};
            }
            resultMap[key] = val;
        }

        return resultMap;

    });

    // This is an internal extension; do not export explicitly.
    return {};
}));
