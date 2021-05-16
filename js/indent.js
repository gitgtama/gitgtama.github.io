/*!
 * Dotgita JS v1.0.0
 * Copyright 2021 The Dotgita Authors
 */
(function (global, factory) {
    "use strict";

    factory(global);

    //
})(window, function (window) {
    "use strict";

    var dotgita = function (selector) {
        return new dotgita.fn.init(selector);
    };

    dotgita.fn = dotgita.prototype = {
        constructor: dotgita,

        length: 0,
    };

    dotgita.stack = dotgita.fn.stack = function () {
        var name,
            abstract = arguments[0] ?? {},
            concrete = arguments[0];

        if (arguments.length === 1) {
            abstract = this;
        }

        if (concrete != null) {
            for (name in concrete) {
                if (name === "__proto__" || abstract === concrete[name]) {
                    continue;
                }

                abstract[name] = concrete[name];
            }
        }

        return abstract;
    };

    var selector = function (abstract) {
        if (abstract instanceof dotgita) {
            abstract = abstract[0];
        }

        return abstract;
    };

    dotgita.stack({
        each: function (items, callback) {
            var options = selector(items);

            options = "string" === typeof options ? {0: options} : options;

            if (options.forEach !== undefined) {
                options.forEach((value, key) => {
                    return callback(value, key, options);
                });
            } else {
                for (var [key, value] of Object.entries(options)) {
                    options[key] = callback(value, key, options);
                }
            }

            return options;
        },

        find: function (abstract, extra) {
            abstract = selector(abstract);

            if (extra === undefined) {
                return this.get(abstract);
            }

            return this.get(abstract + ' ' + extra);
        },

        get: function (abstract, method, extras) {
            extras = extras !== undefined ? extras : [];

            if (! (abstract instanceof dotgita)) {
                return method !== undefined
                    ? this(abstract)[method](...extras)
                    : this(abstract);
            }

            var next = (...args) => {
                if (abstract[method] !== undefined) {
                    return abstract[method](...args);
                }

                return this[method](...[abstract, ...args]);
            };

            return Array.isArray(extras) ? next(...extras) : next;
        },
    });

    dotgita.stack({
        query: function (abstract, prepend) {
            if (prepend !== undefined) {
                return this.queryAll(abstract);
            }

            abstract = selector(abstract);

            if ("string" !== typeof abstract) {
                return abstract;
            }

            return document.querySelector(abstract);
        },

        queryAll: function (abstract) {
            abstract = selector(abstract);

            if ("string" !== typeof abstract) {
                return abstract;
            }

            return document.querySelectorAll(abstract);
        },

        attr: function (abstract, attributes, extra) {
            if ("string" === typeof attributes) {
                attributes = {[attributes]: extra};
            }

            this.each(attributes, (value, key) => {
                this.query(abstract).setAttribute(key, value);
            });
        },

        click: function (abstract, callback) {
            return this.on(abstract, 'click', callback);
        },

        css: function (abstract, styles, extra) {
            if ("string" === typeof styles) {
                styles = {[styles]: extra};
            }

            this.each(styles, (value, key) => {
                this.query(abstract).style[key] = value;
            });
        },

        dropClass: function (abstract, state) {
            var classes = this.getClass(abstract).filter(function (name) {
                return name !== state;
            });

            return this.attr(abstract, 'class', classes.join(' '));
        },

        getClass: function (abstract) {
            return this.query(abstract).getAttribute('class').split(/\s+/);
        },

        html: function (abstract, content) {
            return this.query(abstract).innerHTML = content;
        },

        off: function (abstract, type) {
            abstract = this.query(abstract);

            if (abstract.attachEvent) {
                return abstract.attachEvent('off' + type);
            }

            return abstract.addEventListener('off' + type);
        },

        on: function (abstract, type, callback) {
            abstract = this.query(abstract);

            if (abstract.attachEvent) {
                return abstract.attachEvent('on' + type, callback);
            }

            return abstract.addEventListener(type, callback);
        },

        toggleClass: function (abstract, state) {
            return this.query(abstract).classList.toggle(state);
        },
    });

    var init = dotgita.fn.init = function (selector)  {
        this[0] = selector;

        return new Proxy(this, dotgita);
    };

    init.prototype = dotgita.fn;

    delete dotgita.stack;

    window.dotgita = dotgita;

    window.dtg = dotgita;
    //
});
