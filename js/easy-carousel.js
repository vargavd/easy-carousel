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
            wrapperBorder: '1px solid gray',
            wrapperPadding: '10px',
            wrapperBackground: 'black',
            imgWidth: '100px',
            imgSpace: '10px',
            imgBorder: '10px solid white',
            visibleImgCount: 4,
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
        
        // inline style maker constructor, you can give any number of style:
        //      ('color: white')
        //      ('color: white', 'font-size: 12px')
        StyleMaker = function () {
            var styles = [],
                    
                // functions
                addStyle = function () {
                    var parts;
                    
                    if (arguments.length === 1 && typeof arguments[0] === 'string' && arguments[0].includes(':')) {
                        
                        parts = arguments[0].split(':');
                        styles.push([ parts[0].trim(), parts[1].replaceAll(';', '').trim() ]);
                        
                    } 
                    
                    else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[0] === 'string') {
                        
                        styles.push([ arguments[0].trim(), arguments[1].trim() ]);
                        
                    }
                },
                getStyle = function () {
                    var styleString = '';

                    $.each(styles, function (index, style) {
                        styleString += style[0] + ': ' + style[1] + '; ';
                    });
                            
                    return styleString.trim();
                },
                reset = function () {
                    styles = [];
                };
            
            $.each(arguments, function (index, arg) {
                addStyle(arg);
            });
            
            return {
                addStyle: addStyle,
                getStyle: getStyle,
                reset: reset
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
        var 
            // DOM elements
            $wrapper = $(this),
            $imgWrapper = $('<div>'),
            $imgList = $('<ul>'),
            $buttonLeft = $('<button>'),
            $buttonRight = $('<button>'),
            
            // imgs
            $imgs = $wrapper.find('img').detach(),
                    
            // Style Maker
            sm = new StyleMaker();
            
        settings = $.extend({}, settings, defaultSettings);
        
        // clear the wrapper
        $wrapper.empty();
        
        // make the DOM
        $wrapper.append($imgWrapper.append($imgList), $buttonLeft.text('<<'), $buttonRight.text('>>'));
        
        // insert images and style them
        $imgs.each(function () {
            var $img = $(this),
                $li;
            
            $li = $('<li>').append($img);
            
            sm.reset();
            sm.addStyle('float',         'left');
            sm.addStyle('overflow',      'hidden');
            sm.addStyle('padding-right', settings.imgSpace);
            sm.addStyle('width',         '180px');
            $li.attr('style', sm.getStyle());
            
            sm.reset();
            sm.addStyle('width',      '100%');
            sm.addStyle('border',     settings.imgBorder);
            sm.addStyle('box-sizing', 'border-box');
            $img.attr('style', sm.getStyle());
            
            $imgList.append($li);
        });
        
        // style wrapper
        sm.reset();
        sm.addStyle('position',    'relative');
        sm.addStyle('width',       '750px');
        sm.addStyle('height',      '111px');
        sm.addStyle('border',      settings.wrapperBorder);
        sm.addStyle('background',  settings.wrapperBackground);
        sm.addStyle('padding',     settings.wrapperPadding);
        $wrapper.attr('style', sm.getStyle());
        
        // style images wrapper
        $imgWrapper.attr('style', 'overflow: hidden;');
        
        // style img list
        sm.reset();
        sm.addStyle('width',                '1200px');
        sm.addStyle('height',               '100%');
        sm.addStyle('padding',              '0');
        sm.addStyle('margin',               '0');
        sm.addStyle('list-style-type',      '0');
        sm.addStyle('-webkit-box-shadow',   '0px 0px 17px 0px rgba(0, 0, 0, 0.7)');
        sm.addStyle('-moz-box-shadow',      '0px 0px 17px 0px rgba(0, 0, 0, 0.7)');
        sm.addStyle('box-shadow',           '0px 0px 17px 0px rgba(0, 0, 0, 0.7)');
        $imgList.attr('style', sm.getStyle());
        
        // style buttons
        sm.reset();
        sm.addStyle('position',         'absolute');
        sm.addStyle('left',             '50%');
        sm.addStyle('top',              '122px');
        sm.addStyle('border',           settings.buttonBorder);
        sm.addStyle('background-color', settings.buttonBackground);
        sm.addStyle('cursor',           'pointer');
        sm.addStyle('width',            settings.buttonWidth);
        sm.addStyle('height',           settings.buttonHeight);
        sm.addStyle('padding',          '0');
        sm.addStyle('margin-left',      '-59px');
        $buttonLeft.attr('style', sm.getStyle());
        
        sm.addStyle('margin-left', '10px');
        $buttonRight.attr('style', sm.getStyle());
        
        $($buttonLeft, $buttonRight).mouseenter(function () {
            var $button = $(this);
            
            sm.reset();
            sm.addStyle('position',         'absolute');
            sm.addStyle('left',             '50%');
            sm.addStyle('top',              '122px');
            sm.addStyle('border',           settings.buttonHoverBorder);
            sm.addStyle('background-color', settings.buttonHoverBackground);
            sm.addStyle('cursor',           'pointer');
            sm.addStyle('width',            settings.buttonWidth);
            sm.addStyle('height',           settings.buttonHeight);
            sm.addStyle('padding',          '0');
            sm.addStyle('margin-left',      '-59px');
            $button.attr('style', sm.getStyle());
        });
        $($buttonLeft, $buttonRight).mouseleave(function () {
            var $button = $(this);
            
            sm.reset();
            sm.addStyle('position',         'absolute');
            sm.addStyle('left',             '50%');
            sm.addStyle('top',              '122px');
            sm.addStyle('border',           settings.buttonBorder);
            sm.addStyle('background-color', settings.buttonBackground);
            sm.addStyle('cursor',           'pointer');
            sm.addStyle('width',            settings.buttonWidth);
            sm.addStyle('height',           settings.buttonHeight);
            sm.addStyle('padding',          '0');
            sm.addStyle('margin-left',      '-59px');
            $button.attr('style', sm.getStyle());
        });
        
        
    };
    
    // ONLY FOR TEST
    return {
        StyleMaker: StyleMaker
    };
}));

