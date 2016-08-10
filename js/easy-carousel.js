/*
 * Easy Carousel v0.1
 * A simple image carousel plugin, powered by jQuery.
 *
 * License: GPL2
 * made by VvD
 */

'use strict';

(function ($, factory) {

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = function () {            
            return factory($);
        };
    } else {
        factory($);
    }

}(jQuery, function ($) {
    var
        // settings
        defaultSettings = {
            wrapperBorderColor: '1px solid gray',
            wrapperPadding: '10px',
            wrapperBackground: 'black',
            imgWidth: '100px',
            imgSpace: '10px',
            imgBorder: '10px solid white',
            buttonWidth: '50px',
            buttonHeight: '25px',
            buttonBorder: '1px solid #bbb',
            buttonBackground: 'rgba(255, 255, 255, 0.6)',
            buttonHoverBackground: 'white',
            buttonHoverBorder: '1px solid #bbb'
        },
        
        // helper functions
        isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        },
        
        // inline style maker constructor
        StyleMaker = function (defaultStyles) {
            var styles = [],
                    
                // functions
                addStyle = function () {
                    var parts;
                    
                    // you can call addStyle with 3 mode
                    //      addStyle('color: white')
                    //      addStyle('color', 'white')
                    //      addStyle(['color', 'white'], ['font-size', '12px'])
                    
                    if (arguments.length === 1 && typeof arguments[0] === 'string' && arguments[0].includes(':')) {
                        
                        parts = arguments[0].split(':');
                        styles.push([ parts[0].trim(), parts[1].replaceAll(';', '').trim() ]);
                        
                    } 
                    
                    else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[0] === 'string') {
                        
                        styles.push([ arguments[0].trim(), arguments[1].trim() ]);
                        
                    } 
                    
                    else {
                        $.each(arguments, function (index, arg) {
                            if (!isArray(arg) || typeof arg[0] !== 'string' || typeof arg[1] !== 'string') {
                                return;
                            }
                            
                            styles.push([ arg[0].trim(), arg[1].trim() ]);
                        });
                    }
                    
                },
                getStyle = function () {
                    var styleString = '';

                    $.each(styles, function (index, style) {
                        styleString += style[0] + ': ' + style[1] + '; ';
                    });
                    
                    if (styles.length !== 0) {
                        styleString = 'style="' + styleString.trim() + '"';
                    }
                            
                    return styleString;
                };
            
            if (typeof defaultStyles === 'object' && defaultStyles instanceof Array) {
                $.each(defaultStyles, function (index, style) {
                    addStyle(style);
                });
            }
            
            return {
                addStyle: addStyle,
                getStyle: getStyle
            };
        };
    
    
    // polyfills
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }
    
    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
            
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            }
            
            return this.indexOf(search, start) >= 0;
        };
    }
    
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (target, value) {
            return this.split(target).join(value);
        };
    }
    
    // actual plugin
    $.fn.easyCarousel = function (settings) {
        $.extend(settings, defaultSettings);
    };
    
    // ONLY FOR TEST
    return {
        StyleMaker: StyleMaker
    };
    // ONLY FOR TEST END
}));

