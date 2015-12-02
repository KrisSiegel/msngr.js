msngr.extend((function(external, internal) {
    "use strict";

    return {
        isHtmlElement: function(obj) {
            var t = this.getType(obj);
            return (t.indexOf("[object HTML") === 0) || (t.indexOf("[object global]") === 0);
        },
        isNodeList: function(obj) {
            return (this.getType(obj) === "[object NodeList]");
        },
        findElement: function(element, root) {
            var elms = external.findElements(element, root);
            if (elms !== undefined && elms.length > 0) {
                return elms[0];
            }

            return elms;
        },
        findElements: function(selector, root) {
            var elm;
            if (external.isHtmlElement(selector)) {
                elm = selector;
            }

            if (elm === undefined && external.isString(selector)) {
                var doc = root || document;
                var result = external.querySelectorAllWithEq(selector, doc);
                if (result !== null) {
                    elm = result;
                }
            }

            return elm;
        },
        getDomPath: function(element) {
            var node = external.findElement(element);
            // User gave us jack shit. What the hell, user? Return undefined!
            if (node === undefined) {
                return undefined;
            }

            // There is an id on a node which, by definition, must be unique. So return that!
            if (!external.isEmptyString(node.id)) {
                return "#" + node.id;
            }

            var path;
            var currentTag;
            var next = function(elm) {
                var parent = elm.parentNode;
                if (external.exist(parent)) {
                    currentTag = elm.tagName;
                    if (parent.childNodes.length > 1) {
                        for (var i = 0; i < parent.childNodes.length; ++i) {
                            if (parent.childNodes[i] === elm) {
                                // Found it!
                                currentTag = currentTag + ":eq(" + i + ")";
                                break;
                            }
                        }
                    }

                    if (external.isEmptyString(path)) {
                        path = currentTag;
                    } else {
                        path = currentTag + " > " + path;
                    }

                    if (external.exist(parent.parentNode)) {
                        next(parent);
                    }
                }
            };

            next(element);
            if (external.isEmptyString(path)) {
                node.id = external.id();
                path = "#" + node.id;;
            }

            return path;
        },
        querySelectorAllWithEq: function(selector, root) {
            if (selector === undefined) {
                return null;
            }
            var doc = root || document;
            var queue = [];
            var process = function(input) {
                if (input.indexOf(":eq(") === -1) {
                    return undefined;
                }

                var eqlLoc = input.indexOf(":eq(");
                var sel = input.substring(0, eqlLoc);
                var ind = input.substring((eqlLoc + 4), input.indexOf(")", eqlLoc));
                selector = input.substring(input.indexOf(")", eqlLoc) + 1, input.length).trim();

                if (sel.charAt(0) === ">") {
                    sel = sel.substring(1, sel.length);
                }

                if (selector.charAt(0) === ">") {
                    selector = selector.substring(1, selector.length);
                }

                queue.push({
                    selector: sel,
                    index: parseInt(ind, 10)
                });
            }
            while (selector.indexOf(":eq") !== -1) {
                process(selector);
            }

            var result;
            while (queue.length > 0) {
                var item = queue.shift();
                result = (result || doc).querySelectorAll(item.selector)[item.index];
            }

            if (selector.trim().length > 0) {
                return (result || doc).querySelectorAll(selector);
            }
            return [result];
        },
        querySelectorWithEq: function(selector, root) {
            return external.querySelectorAllWithEq(selector, root)[0];
        }
    };
}));
