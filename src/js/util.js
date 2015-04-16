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

// get data via path, support dot
_.getData = function ( path, json ) {
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

// Return required attribute of element or null
_.getAttr = function ( ele, attr ) {
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

// walk the DOM, call the func when finds filtered element
// having 'data-i18n'
_.walkDOM = function ( dom, func, filter ) {
    var node,
        passed;

    if ( dom && 1 === dom.nodeType ) {
        passed = filter ? filter( dom ) : true;

        if ( passed ) {
            func( dom );
        }

        node = dom.firstChild;
        while ( node ) {
            _.walkDOM( node, func, filter );
            node = node.nextSibling;
        }
    }
};

// Returns array of elements that have attribute 'data-i18n'
_.filterNodes = function ( root ) {
    var nodes = [];

    // traverse DOM tree and collect elements with 'data-i18n' attribute
    _.walkDOM( root, function ( ele ) {
        nodes.push( ele );
    }, function ( ele ) {
        return _.hasAttr( ele, 'data-i18n' );
    });

    return nodes;
};

// Translate each node in array with given language table
_.translate = function ( nodes, table ) {
    var key, text, i, length;

    for ( i = 0, length = nodes.length; i < length; i++ ) {
        key = _.getAttr( nodes[i], 'data-i18n' );
        text = _.getData( key, table );

        if ( typeof text === 'string' ) {
            _.setText( nodes[i], text );
        }
    }
};
