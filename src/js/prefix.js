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
