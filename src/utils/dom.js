msngr.extend((function (external, internal) {
    "use strict";

    return {
        isHtmlElement: function (obj) {
            var t = this.getType(obj);
            return (t.indexOf("[object HTML") === 0) || (t.indexOf("[object global]") === 0);
        },
        isNodeList: function (obj) {
            return (this.getType(obj) === "[object NodeList]");
        },
        findElement: function (element, root) {
            var elms = external.findElements(element, root);
            if (elms !== undefined && elms.length > 0) {
                return elms[0];
            }

            return elms;
        },
        findElements: function (selector, root) {
            var elm;
            if (external.isHtmlElement(selector)) {
                elm = selector;
            }

            if (elm === undefined && external.isString(selector)) {
                var doc = root || document;
                var result = doc.querySelectorAll(selector);
                if (result !== null) {
                    elm = result;
                }
            }

            return elm;
        },
        getDomPath: function (element) {
            var node = external.isHtmlElement(element) ? element : undefined;
            if (node === undefined) {
                return undefined;
            }

            if (node.id === undefined) {
                node.id = external.id();
            }

            return "#" + node.id;
        },
        querySelectorAllWithEq: function (selector, root) {
            if (selector === undefined) {
                return null;
            }
            var doc = root || document;
            var queue = [];
            var process = function (input) {
                if (input.indexOf(":eq(") === -1) {
                    return undefined;
                }

                var eqlLoc = input.indexOf(":eq(");
                var sel = input.substring(0, eqlLoc);
                var ind = input.substring((eqlLoc + 4), input.indexOf(")", eqlLoc));
                selector = input.substring(input.indexOf(")", eqlLoc) + 1, input.length);

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
        querySelectorWithEq: function (selector, root) {
            return external.querySelectorAllWithEq(selector, root)[0];
        }
    };
}));
