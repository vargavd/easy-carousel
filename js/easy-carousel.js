/*
 * Easy Carousel v0.1
 * A simple image carousel plugin, powered by jQuery.
 * 
 * License: GPL2
 * made by VvD
 */

(function ($, factory) {
    
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = function () {
            return factory($);
        }
    } else {
        factory($);
    }
    
}(jQuery, function ($) {
    var 
        // settings
        defaultSettings = {
            wrapperBorderColor: "1px solid gray",
            wrapperPadding: "10px",
            wrapperBackground: "black",
            imgWidth: "100px",
            imgSpace: "10px",
            imgBorder: "10px solid white",
            buttonWidth: "50px",
            buttonHeight: "25px",
            buttonBorder: "1px solid #bbb",
            buttonBackground: "rgba(255, 255, 255, 0.6)",
            buttonHoverBackground: "white",
            buttonHoverBorder: "1px solid #bbb"
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
                    
                    // if called: addStyle("color: white")
                    if (arguments.length === 1 && typeof arguments[0] === "string" && arguments[0].includes(":")) {
                        
                        parts = arguments[0].split(":");
                        styles[parts[0].trim()] = parts[1].replace(/;/g, "").trim();
                        
                    } 
                    
                    // if called: addStyle("color", "white")
                    else if (arguments.length === 2 && typeof arguments[0] === "string" && typeof arguments[0] === "string") {
                        
                        styles[arguments[0].trim()] = arguments[1].trim();
                        
                    } 
                    
                    // if called: addStyle(["color", "white"], ["font-size", "12px"])
                    else {
                        $.each(arguments, function (index, arg) {
                            if (!isArray(arg) || typeof arg[0] !== "string" || typeof arg[1] !== "string") {
                                return;
                            }
                            
                            styles[arg[0].trim()] = arg[1].replaceAll(";", "").trim();
                        })
                    }
                },
                getString = function () {
                    var string = "style: ";
                    
                    $.each(styles, function (index, style) {
                        
                    });
                    
                    return string;
                };
            
            if (typeof defaultStyles === "object" && defaultStyles instanceof Array) {
                $.each(defaultStyles, function (index, style) {
                    addStyle(style);
                });
            }
            
            return {
                addStyle: addStyle,
                getString: getString
            };
        };
    
    
    // polyfills
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }
    
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
    
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (target, value) {
            return this.split(target).join(value);
        }
    }
    
    
    // actual plugin
    $.fn.easyCarousel = function (settings) {
        $.extend(settings, defaultSettings);
    };
}));

