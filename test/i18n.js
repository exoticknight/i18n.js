/*
 * i18n.js
 * author: exoticknight
 * email: draco.knight0@gmail.com
 * license: MIT
 * version: 0.0.1
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
    push = array.push;
// Some utils, registered under internal object _
// ----------

// figure out array
_.isArray = Array.isArray || function( obj ) {
    return Object.prototype.toString.call( obj ) === '[object Array]';
};

// figure out object
_.isObject = function( obj ) {
    return Object.prototype.toString.call( obj ) === '[object Object]';
};


// deep copy object, modified from jQuery
// can handle array and nested objects, not perfect
_.deepCopy = function ( des, src ) {
    var beCopiedIsArray = false,
        target,
        name,
        clone,
        beCopied;

    target = des;

    for ( name in src ) {
        beCopied = src[name];

        if ( beCopied === src ) {
            continue;
        }

        if ( _.isObject( beCopied ) || ( beCopiedIsArray = _.isArray( beCopied ) ) ) {

            if ( beCopiedIsArray ) {
                beCopiedIsArray = false;
                clone = [];
            } else {
                clone = {};
            }

            target[name] = _.deepCopy( clone, beCopied );

        } else if ( beCopied !== undefined ) {
            target[name] = beCopied;
        }

    }

    return target;
};

// get translation via path, support dot
_.getTranslatedText = function ( path, json ) {
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
};

// Return true if ele has attribute otherwise false
_.hasAttr = function ( ele, attr ) {
    return ele.hasAttribute ? ele.hasAttribute( attr ) : ele[attr] !== undefined;
};

// Return value of required attribute of element or '' if attribute does not exist
_.getAttr = function ( ele, attr ) {
    return ( ele.getAttribute && ele.getAttribute( attr ) ) || '';
};

// cross-browser set text
_.setText = function ( ele, text ) {
    var nodeType = ele.nodeType,
        textAttr;

    if ( nodeType && 1 === nodeType ) {
        textAttr = ( 'innerText' in ele ) ? 'innerText' : 'textContent';
        ele[textAttr] = text;
    }
};

// Walk the DOM, call the visit
_.walkDOM = function ( dom, visit ) {
    var node;

    if ( dom && ( 1 === dom.nodeType || 11 === dom.nodeType ) ) {
        visit( dom );

        node = dom.firstChild;
        while ( node ) {
            _.walkDOM( node, visit );
            node = node.nextSibling;
        }
    }
};

// Returns array of elements that have attribute 'data-i18n'
_.filterNodes = function ( root ) {
    var nodes = [];

    // traverse DOM tree and collect elements with 'data-i18n' attribute
    _.walkDOM( root, function ( ele ) {
        if ( _.hasAttr( ele, 'data-i18n' ) ) {
            nodes.push( ele );
        }
    });

    return nodes;
};

// Translate each node in array with given language table
_.translate = function ( nodes, table ) {
    var key, text, i, length;

    for ( i = 0, length = nodes.length; i < length; i++ ) {
        key = nodes[i].getAttribute( 'data-i18n' );

        if ( key ) {
            text = _.getTranslatedText( key, table );

            if ( typeof text === 'string' ) {
                _.setText( nodes[i], text );
            }
        }
    }
};
// API
// ---


// Restore the previous value of 'i18n' and return our own i18n object.
i18n.noConflict = function () {
    root.i18n = previousi18n;
    return i18n;
};

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
    TRANSLATION_TABLE = _.deepCopy( TRANSLATION_TABLE, table );

    return i18n;
};

// Return the current set language
i18n.current = function () {
    return CURRENT_LANGUAGE;
};

// Translate nodes, but won't cache them
// Return translated nodes
i18n.translate = function ( eles ) {
    var langTable, nodeList, i, index, nodes;

    langTable = TRANSLATION_TABLE[CURRENT_LANGUAGE];

    if ( langTable ) {
        nodeList = Object.prototype.toString.call( eles ) === '[object NodeList]' ||
            'length' in eles ?
            eles :
            [eles];

        for ( i = 0, index = nodeList.length; i < index; i++ ) {
            nodes = _.filterNodes( nodeList[i] );
            _.translate( nodes, langTable );
        }
    }

    return nodes;
};

// Change the language, apply to all cached nodes or document.body
i18n.use = function ( language ) {
    var langTable = TRANSLATION_TABLE[language],
        nodes;

    if ( langTable ) {
        nodes = CACHE_ENABLED ?
            CACHE_ELEMENTS :
            _.filterNodes( root.document.body );

        _.translate( nodes, langTable );
        CURRENT_LANGUAGE = language;
    }

    return i18n;
};

// walk the DOM and keep the references to each 'i18n' element.
// will walk the parameter 'element' if given otherwise body
i18n.cache = function ( element ) {
    var isBody = ( element === undefined ),
        nodes = _.filterNodes( isBody ? root.document.body : element );

    // clean cache before recache the body
    if ( isBody ) {
        CACHE_ELEMENTS.length = 0;
    }

    push.apply( CACHE_ELEMENTS, nodes );
    CACHE_ENABLED = true;

    return i18n;
};

// Clean the cache
i18n.cleanCache = function () {
    CACHE_ELEMENTS.length = 0;
    CACHE_ENABLED = false;

    return i18n;
};


// Return this library
return i18n;

});