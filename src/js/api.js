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
i18n.translate = function ( eles ) {
    var langTable, nodeList, i, index, nodes;

    langTable = TRANSLATION_TABLE[CURRENT_LANGUAGE];

    if ( langTable ) {
        nodeList = Object.prototype.toString.call( eles ) === '[object NodeList]' ?
            eles :
            [eles];

        for ( i = 0, index = nodeList.length; i < index; i++ ) {
            nodes = _.filterNodes( nodeList[i] );
            _.translate( nodes, langTable );
        }
    }

    return i18n;
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

