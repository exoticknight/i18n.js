/*
 * simpleTemplate.bare.js
 * author: exotcknight
 * email: draco.knight0@gmail.com
 * license: MIT
 * version: 1.2
*/
;(function( root, name, definition ) {
    if ( typeof define === 'function' && define.amd ) {
      define( [], definition );
    } else if ( typeof module === 'object' && module.exports ) {
      module.exports = definition();
    } else {
      root[name] = definition();
    }
})( this, 'i18n', function() {
// Save the global object, which is window in browser / global in Node.js.
var root = this;

// This library.
var i18n = {};

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

// Some utils
// ----------

// figure out array
var isArray = Array.isArray || function( obj ) {
    return Object.prototype.toString.call( obj ) === '[object Array]';
},

// figure out object
isObject = function( obj ) {
    return Object.prototype.toString.call( obj ) === '[object Object]';
},


// deep copy object, modified from jQuery
// can handle array and nested objects, not perfect
deepCopy = function ( des, src ) {
    var beCopiedIsArray = false,
        target,
        name,
        clone,
        beCopied;

    target = des;

    for ( name in src ) {
        beCopied = src[name];

        if ( isObject( beCopied ) || ( beCopiedIsArray = isArray( beCopied ) ) ) {

            if ( beCopiedIsArray ) {
                beCopiedIsArray = false;
                clone = [];
            } else {
                clone = {};
            }

            target[name] = deepCopy( clone, beCopied );

        } else if ( beCopied !== undefined ) {
            target[name] = beCopied;
        }

    }

    return target;
},

// get data via path, support dot
getData = function ( path, json ) {
    var fieldPath = path.split( '.' ),
        data = json,
        index,
        indexLength;

    for ( index = 0, indexLength = fieldPath.length; index < indexLength; index++ ) {
        data = data[fieldPath[index]];
        if ( !data ) {
            return '';
        }
    }

    return data;
},

// Return true if ele has attribute otherwise false
hasAttr = function ( ele, attr ) {
    return ele.hasAttribute ? ele.hasAttribute( attr ) : ele[attr] !== undefined;
},

// Return required attribute of element or null
getAttr = function ( ele, attr ) {
    var result = ( ele.getAttribute && ele.getAttribute( attr ) ) || null;

    if( !result ) {
        var attrs = ele.attributes,
            length = attrs.length;
        for( var i = 0; i < length; i++ )
            if( attrs[i].nodeName === attr ) {
                result = attrs[i].nodeValue;
            }
    }

    return result;
},

// cross-browser set text
setText = function ( ele, text ) {
    var nodeType = ele.nodeType,
        textAttr;

    if ( nodeType ) {
        textAttr = ( 'innerText' in ele ) ? 'innerText' : 'textContent';
        ele[textAttr] = text;
    }
},

// walk the DOM, call the func when finds filtered element
// having 'data-i18n'
walkDOM = function ( dom, func, filter ) {
    var node,
        passed;

    if ( dom && 1 === dom.nodeType ) {
        passed = filter ? filter( dom ) : true;

        if ( passed ) {
            func( dom );
        }

        node = dom.firstChild;
        while ( node ) {
            walkDOM( node, func, filter );
            node = node.nextSibling;
        }
    }
},

// Returns array of elements that have attribute 'data-i18n'
filterNodes = function ( root ) {
    var nodes = [];

    // traverse DOM tree and collect elements with 'data-i18n' attribute
    walkDOM( root, function ( ele ) {
        var key = getAttr( ele, 'data-i18n' );
        nodes.push({
            'ele': ele,
            'key': key
        });

    }, function ( ele ) {
        return hasAttr( ele, 'data-i18n' );
    });

    return nodes;
},

translate = function ( nodes ) {
    for ( i = 0, length = nodes.length; i < length; i++ ) {
        text = getData( nodes[i].key, langTable );

        if ( typeof text === 'string' ) {
            setText( nodes[i].ele, text );
        }
    }
};

// Restore the previous value of 'i18n' and return our own i18n object.
i18n.noConflict = function () {
    root.i18n = previousi18n;
    return i18n;
};

// API
// ---

// Load the translation table
// translation table should be in following form:
// {
//     'en': {
//         'BUTTON_TEXT': 'submit'
//     },
//     'zh': {
//         'BUTTON_TEXT': '提交'
//     }
// }
i18n.load = function ( table ) {
    TRANSLATION_TABLE = deepCopy( TRANSLATION_TABLE, table );
};

// Return the current language
i18n.current = function () {
    return CURRENT_LANGUAGE;
};

// Change the language,
// set text of element after calling the callback
i18n.use = function ( language ) {
    var langTable = TRANSLATION_TABLE[language];

    var nodes = CACHE_ENABLED ?
        CACHE_ELEMENTS :
        filterNodes( root.document.body );

    if ( langTable ) {
        translate( nodes );
        CURRENT_LANGUAGE = language;
    }
};

// walk the DOM and keep the references to each 'i18n' element.
// will walk the parameter 'element' if given otherwise body
i18n.cache = function ( element ) {
    var isBody = ( element === undefined ),
        nodes = filterNodes( isBody ? root.document.body : element );

    // clean cache before recache the body,
    // or translate new nodes before caching them
    if ( isBody ) {
        CACHE_ELEMENTS.length = 0;
    } else {
        translate( nodes );
    }

    push.apply( CACHE_ELEMENTS, nodes );
    CACHE_ENABLED = true;
};

// Clean the cache
i18n.cleanCache = function () {
    CACHE_ELEMENTS.length = 0;
    CACHE_ENABLED = false;
};


// Return this library
return i18n;
});