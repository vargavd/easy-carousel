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
            imgWidth: '180px',
            imgSpace: '10px',
            imgBorder: '10px solid white',
            visibleImgCount: 3,
            buttonWidth: '50px',
            buttonHeight: '25px',
            buttonBorder: '1px solid #bbb',
            buttonBackground: 'rgba(255, 255, 255, 0.6)',
            buttonHoverBackground: 'white',
            buttonHoverBorder: '1px solid #bbb',
            secondsBetweenSlide: 3,
            modalBackground: 'rgba(0, 0, 0, 0.8)',
            modalWindowBackground: 'white',
            modalWindowBorder: '1px solid white',
            modalCaptionFontSize: '20px',
            modalCaptionColor: '#888',
            modalCaptionImgTextColor: '#666',
            modalButtonBackground: '#666',
            modalButtonHoverBackground: '#666',
            modalButtonColor: '#ddd',
            modalButtonHoverColor: '#ddd',
            modalButtonBorder: '1px solid #333',
            modalButtonHoverBorder: '1px solid #333',
            modalButtonPadding: '3px 7px',
            modalButtonMargin: '5px 20px',
            modalButtonFontWeight: 'bold'
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
                    
                    else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
                        
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
                reset = function (styleAttr) {
                    var styleAttrParts,
                        styleParts;
                       
                    styles = [];
                    styleAttrParts = (typeof styleAttr === 'string') ? styleAttr.split(';') : [];
                    
                    $.each(styleAttrParts, function (index, style) {
                        if (style.includes(':')) {
                            styleParts = style.split(':');
                            styles.push([styleParts[0].trim(), styleParts[1].trim()]);
                        }
                    });
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
        
        // jQuery inheritance magic :)
//        $ecElem = function (selector) {
//            var ret = Object.create($(selector));
//            
//            ret.modStyle  = function () {
//                var $elem  = $(this),
//                    styles = [],
//                    inlineStyle = $elem.attr('style');
//            
//                console.log(inlineStyle);
//            };
//            
//            return ret;
//        };
    
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
    
    // the actual plugin
    $.fn.easyCarousel = function (settings) {
        var 
            // DOM elements
            $wrapper          = $(this),
            $imgWrapper       = $('<div>'),
            $imgList          = $('<ul>'),
            $buttonLeft       = $('<button>'),
            $buttonRight      = $('<button>'),
            $modalBg          = $('<div>'),
            $modalPos         = $('<div>'),
            $modalWindow      = $('<div>'),
            $modalImg         = $('<img>'),
            $modalCaption     = $('<div>'),
            $modalImgText     = $('<strong>'),
            $modalButtonLeft  = $('<button>'),
            $modalButtonRight = $('<button>'),
            
            // imgs
            $imgs = $wrapper.find('img').detach(),
                    
            // Style Maker
            sm = new StyleMaker(),
                    
            // helper function
            toValue = function (value) {
                return parseInt(value.replaceAll('px', '').replaceAll('em', ''));
            },
                    
            // sizes and positions
            wrapperWidth, imgListWidth,
                    
            // main functions
            calculation, domCreation, manageSliderAndModal;
        
        calculation    = function () {
            var 
                // removing units from the settings
                imgWidth       = toValue(settings.imgWidth),
                imgSpace       = toValue(settings.imgSpace),
                wrapperPadding = toValue(settings.wrapperPadding);
                
            // actual calculation
            imgListWidth  = (imgWidth + imgSpace) * $imgs.length + 'px';
            wrapperWidth  = (imgWidth + imgSpace) * settings.visibleImgCount - wrapperPadding + 'px';
        };
        domCreation    = function () {
            var createSlider, createModal;

            createSlider = function () {
                // clear the wrapper
                $wrapper.empty();

                // insert elements                            
                $wrapper.append(
                    $imgWrapper.append(
                        $imgList), 
                    $buttonLeft.text('<<'), 
                    $buttonRight.text('>>'));

                // insert images and style them
                $imgs.each(function () {
                    var $img = $(this),
                        $li;

                    $li = $('<li>').append($img);

                    sm.reset();
                    sm.addStyle('float',         'left');
                    sm.addStyle('overflow',      'hidden');
                    sm.addStyle('padding-right', settings.imgSpace);
                    sm.addStyle('width',         settings.imgWidth);
                    $li.attr('style', sm.getStyle());

                    sm.reset();
                    sm.addStyle('width',      '100%');
                    sm.addStyle('border',     settings.imgBorder);
                    sm.addStyle('box-sizing', 'border-box');
                    sm.addStyle('cursor',     'pointer');
                    $img.attr('style', sm.getStyle());

                    $imgList.append($li);
                });

                // style wrapper
                sm.reset();
                sm.addStyle('position',    'relative');
                sm.addStyle('width',       wrapperWidth);
                sm.addStyle('border',      settings.wrapperBorder);
                sm.addStyle('background',  settings.wrapperBackground);
                sm.addStyle('padding',     settings.wrapperPadding);
                $wrapper.attr('style', sm.getStyle());

                // style images wrapper
                $imgWrapper.attr('style', 'overflow: hidden;');

                // style img list
                sm.reset();
                sm.addStyle('width',                imgListWidth);
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
                sm.addStyle('bottom',           '-14px');
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

                // button style events
                $([$buttonLeft[0], $buttonRight[0]])
                        .mouseenter(function () {
                            var $button = $(this);

                            sm.reset($button.attr('style'));
                            sm.addStyle('border',           settings.buttonHoverBorder);
                            sm.addStyle('background-color', settings.buttonHoverBackground);
                            $button.attr('style', sm.getStyle());
                        })
                        .mouseleave(function () {
                            var $button = $(this);

                            sm.reset($button.attr('style'));
                            sm.addStyle('border',           settings.buttonBorder);
                            sm.addStyle('background-color', settings.buttonBackground);
                            $button.attr('style', sm.getStyle());
                        });
            };
            createModal = function () {
                // insert elements
                $modalBg.append(
                $modalPos.append(
                    $modalWindow.append(
                        $modalImg,
                        $modalCaption.append(
                            '<span></span> of <span></span> - ',
                            $modalImgText),
                        $modalButtonLeft.text('<<'), 
                        $modalButtonRight.text('>>'))));

                $wrapper.after($modalBg);
                
                // style modal background
                sm.reset();
                sm.addStyle('background', settings.modalBackground);
                sm.addStyle('position',   'absolute');
                sm.addStyle('height',     '100%');
                sm.addStyle('width',      '100%');
                sm.addStyle('top',        '0');
                sm.addStyle('left',       '0');
                sm.addStyle('display',    'none');
                $modalBg.attr('style', sm.getStyle());

                // style modal positioning div
                sm.reset();
                sm.addStyle('display',        'table-cell');
                sm.addStyle('height',         '100%');
                sm.addStyle('vertical-align', 'middle');
                sm.addStyle('text-align',     'center');
                $modalPos.attr('style', sm.getStyle());

                // style modal window
                sm.reset();
                sm.addStyle('background', settings.modalWindowBackground);
                sm.addStyle('border',     settings.modalWindowBorder);
                sm.addStyle('width',      '70%');
                sm.addStyle('margin',     '0 auto');
                $modalWindow.attr('style', sm.getStyle());

                // style modal img and caption
                $modalImg.attr('style', 'width: 100%');

                sm.reset();
                sm.addStyle('font-size', settings.modalCaptionFontSize);
                sm.addStyle('color',     settings.modalCaptionColor);
                $modalCaption.attr('style', sm.getStyle());

                $modalImgText.attr('style', 
                                   'color: ' + settings.modalCaptionImgTextColor);

                sm.reset();
                sm.addStyle('background',  settings.modalButtonBackground);
                sm.addStyle('color',       settings.modalButtonColor);
                sm.addStyle('border',      settings.modalButtonBorder);
                sm.addStyle('padding',     settings.modalButtonPadding);
                sm.addStyle('font-weight', settings.modalButtonFontWeight);
                sm.addStyle('margin',      settings.modalButtonMargin);
                sm.addStyle('cursor',      'pointer');

                $([$modalButtonLeft[0], $modalButtonRight[0]])
                        .attr('style', sm.getStyle())
                        .mouseenter(function () {
                            var $button = $(this);

                            sm.reset($button.attr('style'));
                            sm.addStyle('color',            settings.modalButtonHoverColor);
                            sm.addStyle('border',           settings.modalButtonHoverBorder);
                            sm.addStyle('background-color', settings.modalButtonHoverBackground);
                            $button.attr('style', sm.getStyle());
                        })
                        .mouseleave(function () {
                            var $button = $(this);

                            sm.reset($button.attr('style'));
                            sm.addStyle('color',            settings.modalButtonColor);
                            sm.addStyle('border',           settings.modalButtonBorder);
                            sm.addStyle('background-color', settings.modalButtonBackground);
                            $button.attr('style', sm.getStyle());
                        });
        };
            
            createSlider();
            createModal();
        };
        manageSliderAndModal = function () {
            var 
                // sliding context
                slideVal         = toValue(settings.imgWidth) + toValue(settings.imgSpace),
                slideMaxVal      = (settings.visibleImgCount - $imgs.length) * slideVal,
                slideCurrentVal  = 0,
                msBetweenSlides  = settings.secondsBetweenSlide * 1000,
                animIsInProgress = false,
                
                // sliding functions
                animFinished = function () {
                    animIsInProgress = false;
                },
                slideLeft = function () {
                    slideCurrentVal -= slideVal;
                    
                    $imgList.animate({
                        marginLeft: slideCurrentVal
                    }, 1000, animFinished);
                },
                slideRight = function () {
                    slideCurrentVal += slideVal;
                    
                    $imgList.animate({
                        marginLeft: slideCurrentVal
                    }, 1000, animFinished);
                },
                slideBack = function () {
                    slideCurrentVal = 0;
                    
                    $imgList.animate({
                        marginLeft: slideCurrentVal
                    }, 1000, animFinished);
                },
                slideFront = function () {
                    slideCurrentVal = slideMaxVal;
                    
                    $imgList.animate({
                        marginLeft: slideCurrentVal
                    }, 1000, animFinished);
                },
                
                // timing context
                intervalId,
                
                // sliding events
                slideEvent = function () {                    
                    if (slideCurrentVal === slideMaxVal) {
                        slideBack();
                    }
                    else {
                        slideLeft();
                    }
                },
                leftClicked = function () {
                    clearInterval(intervalId);
                    
                    if (animIsInProgress) {
                        $imgList.stop();
                    }
                    else {
                        animIsInProgress = true;
                    }
                    
                    if (slideCurrentVal === 0) {
                        slideFront();
                    }
                    else {
                        slideRight();
                    }
                    
                    intervalId = setInterval(slideEvent, msBetweenSlides);
                },
                rightClicked = function () {
                    clearInterval(intervalId);
                    
                    if (animIsInProgress) {
                        $imgList.stop();
                    }
                    else {
                        animIsInProgress = true;
                    }
                    
                    if (slideCurrentVal === slideMaxVal) {
                        slideBack();
                    }
                    else {
                        slideLeft();
                    }

                    intervalId = setInterval(slideEvent, msBetweenSlides);
                },
                        
                // modal context
                indexOfActiveImg = -1,
                
                // modal helper function
                showImage = function () {
                    var 
                        $img       = $imgs.eq(indexOfActiveImg),
                        imgSrc     = $img.attr('src'),
                        imgText    = $img.attr('alt');
                
                    $modalImg.attr('src', imgSrc);
                    $modalImg.attr('alt', imgText);
                    
                    $modalCaption.find('span:first-of-type').text(indexOfActiveImg + 1);
                    $modalCaption.find('span:last-of-type').text($imgs.length);
                    
                    $modalImgText.text(imgText);
                    
                    sm.reset($modalBg.attr('style'));
                    sm.addStyle('display', 'table');
                    $modalBg.attr('style', sm.getStyle());
                },
                        
                // modal events
                imgClicked = function () {
                    indexOfActiveImg = $imgs.index($(this));
                
                    if (animIsInProgress) {
                        $imgList.finish();
                        animIsInProgress = false;
                    }
                    
                    clearInterval(intervalId);
                    
                    showImage();
                },
                leftModalButtonClicked = function (event) {
                    indexOfActiveImg = indexOfActiveImg === 0 ? $imgs.length - 1 : indexOfActiveImg - 1;
                    
                    showImage();
                    
                    event.stopPropagation();
                },
                rightModalButtonClicked = function (event) {
                    indexOfActiveImg = indexOfActiveImg === $imgs.length - 1 ? 0 : indexOfActiveImg + 1;
                    
                    showImage();
                    
                    event.stopPropagation();
                },
                closeModal = function () {
                    indexOfActiveImg = -1;
                    
                    sm.reset($modalBg.attr('style'));
                    sm.addStyle('display', 'none');
                    $modalBg.attr('style', sm.getStyle());
                    
                    intervalId = setInterval(slideEvent, msBetweenSlides);
                },
                modalWindowClicked = function (event) {
                    event.stopPropagation();
                };
                
                
            // click events
            $buttonLeft.click(leftClicked);
            $buttonRight.click(rightClicked);
            $modalButtonLeft.click(leftModalButtonClicked);
            $modalButtonRight.click(rightModalButtonClicked);
            $imgs.click(imgClicked);
            $modalBg.click(closeModal);
            $modalWindow.click(modalWindowClicked);
            
            // and let the sliding begin
            intervalId = setInterval(slideEvent, msBetweenSlides);
        };
        
        settings = $.extend({}, settings, defaultSettings);
        
        // calculate the positions and sizes
        calculation();
        
        // creating the DOM
        domCreation();
        
        // manage the action
        manageSliderAndModal();
    };
    
    // ONLY FOR TEST
    return {
        StyleMaker: StyleMaker
    };
}));

