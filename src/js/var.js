// Save the global object, which is window in browser / global in Node.js.
var root = this;

// This library and internal object
var i18n = {},
    _ = {};

// Current version.
i18n.version = '0.0.1';

// Internel store
var TRANSLATION_TABLE = {},
    CACHE_ELEMENTS = [];

// Current language
var CURRENT_LANGUAGE = '',
    CACHE_ENABLED = false;

// Save the previous value of the `i18n` variable, can be restored later
// if 'noConflict' is called.
var previousi18n = root.i18n;

// Local references to array methods.
var array = [],
    push = array.push,
    slice = array.slice,
    splice = array.splice;
