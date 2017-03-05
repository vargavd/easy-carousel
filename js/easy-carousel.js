/*
 * Easy Carousel v0.1
 * A simple image carousel plugin, powered by jQuery.
 *
 * License: GPL2
 * made by VargaVD
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
            imgWidth: '300px',
            imgMaxHeight: '150px',
            imgSpace: '10px',
            imgBorder: '5px solid white',
            visibleImgCount: 3,
            buttonWidth: '50px',
            buttonHeight: '25px',
            buttonBorder: '1px solid #bbb',
            buttonBackground: 'rgba(255, 255, 255, 0.6)',
            buttonColor: 'black',
            buttonFontWeight: 'bold',
            buttonHoverBackground: 'white',
            buttonHoverBorder: '1px solid #bbb',
            secondsBetweenSlide: 3,
            modalBackground: 'rgba(0, 0, 0, 0.8)',
            modalWindowBackground: 'white',
            modalWindowBorder: '1px solid white',
            modalNumberFontSize: '24px',
            modalNumberColor: '#333',
            modalCaptionFontSize: '20px',
            modalCaptionColor: '#666',
            modalCaptionFontWeight: 'bold',
            modalCaptionLineHeight: '30px',
            modalButtonBackground: 'transparent',
            modalButtonHoverBackground: '#666',
            modalButtonColor: '#333',
            modalButtonHoverColor: 'white',
            modalButtonBorder: '1px solid #333',
            modalButtonHoverBorder: '1px solid #333',
            modalButtonPadding: '3px 7px',
            modalButtonMargin: '0 10px',
            modalButtonFontWeight: 'bold',
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
                reset: reset,
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
            $modalInfo        = $('<div>'),
            $modalNumber      = $('<div>'),
            $modalCaption     = $('<div>'),
            $modalButtons     = $('<div>'),
            $modalButtonLeft  = $('<button>'),
            $modalButtonClose = $('<button>'),
            $modalButtonRight = $('<button>'),
            $loaderImg        = $('<img>'),

            // imgs
            $imgs = $wrapper.find('img').detach(),

            // Style Maker
            sm = new StyleMaker(),

            // helper function
            toValue = function (value) {
                return parseInt(value.replaceAll('px', '').replaceAll('em', ''));
            },
            style   = function ($elem, styles, origStyle) {
                if (origStyle) {
                    sm.reset($elem.attr('style'));
                } else {
                    sm.reset();
                }

                $.each(styles, function (index, stylePair) {
                    sm.addStyle(stylePair[0], stylePair[1]);
                });

                $elem.attr('style', sm.getStyle());
            },

            // sizes and positions
            wrapperWidth, imgListWidth, modalImgWidth, modalImgMaxHeight, modalImgMaxRatio,

            // main functions
            waitUntilImagesLoaded, calculation, domCreation, setUpSliderAndModal;

        waitUntilImagesLoaded = function (continueSettingUp) {
            var
                // interval context
                imgLoadedCheckerId,

                // main functions
                imgsLoaded = function () {
                    // stop checking :)
                    clearInterval(imgLoadedCheckerId);

                    continueSettingUp();
                },
                checking  = function () {
                    var i;

                    // return if imgs are not loaded yet
                    for (i = 0; i < $imgs.length; i++) {
                        if ($imgs.eq(i)[0].width < 50) {
                            return;
                        }
                    }

                    imgsLoaded();
                };

            // hide everyting
            $wrapper.children().hide();

            // insert loader img
            $wrapper.append($loaderImg.attr('src', 'data:image/gif;base64,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'));

            // start checking
            imgLoadedCheckerId = setInterval(checking, 300);
        };
        calculation           = function () {
            var
                // context,
                i, maxImgWidth = 0,

                // removing units from the settings
                imgSpace = toValue(settings.imgSpace),

                // helper functions
                processImg = function () {
                    var imgWidth  = this.width,
                        imgHeight = this.height,
                        imgRatio  = this.width / this.height,
                        maxWidth  = toValue(settings.imgWidth),
                        maxHeight = toValue(settings.imgMaxHeight);

                    if ((maxWidth / imgWidth) * imgHeight > maxHeight) {
                        imgWidth *= maxHeight / imgHeight;
                        imgHeight = maxHeight;
                    } else {
                        imgHeight *= maxWidth / imgWidth;
                        imgWidth   = maxWidth;
                    }

                    if (imgWidth > maxImgWidth) {
                        maxImgWidth = imgWidth;
                    }

                    this.width = imgWidth;
                    this.height = imgHeight;

                    $(this).attr('data-ratio', imgRatio.toFixed(2));

                    imgListWidth += imgWidth + imgSpace;
                };

            imgListWidth = 0;
            wrapperWidth = 0;

            $imgs.each(processImg);

            for (i = 0; i < settings.visibleImgCount && i < $imgs.length; i++) {
                wrapperWidth += $imgs.eq(i)[0].width + imgSpace;
            }

            wrapperWidth -= imgSpace;

            modalImgWidth = 0.9 * screen.width;
            modalImgMaxHeight = 0.8 * screen.height;

            modalImgMaxRatio = modalImgWidth / modalImgMaxHeight;
        };
        domCreation           = function () {
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
                    sm.addStyle('padding-right', settings.imgSpace);
                    $li.attr('style', sm.getStyle());

                    sm.reset();
                    sm.addStyle('border',     settings.imgBorder);
                    sm.addStyle('box-sizing', 'border-box');
                    sm.addStyle('cursor',     'pointer');
                    $img.attr('style', sm.getStyle());

                    $imgList.append($li);
                });

                // style wrapper
                sm.reset();
                sm.addStyle('position',    'relative');
                sm.addStyle('z-index',     '0');
                sm.addStyle('width',       wrapperWidth + 'px');
                sm.addStyle('border',      settings.wrapperBorder);
                sm.addStyle('background',  settings.wrapperBackground);
                sm.addStyle('padding',     settings.wrapperPadding);
                $wrapper.attr('style', sm.getStyle());

                // style loader img
                $loaderImg.attr('style', 'display: none;');

                // style images wrapper
                $imgWrapper.attr('style', 'overflow: hidden;');

                // style img list
                sm.reset();
                sm.addStyle('width',                imgListWidth + 'px');
                sm.addStyle('height',               '100%');
                sm.addStyle('padding',              '0');
                sm.addStyle('margin',               '0');
                sm.addStyle('list-style-type',      'none');
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
                sm.addStyle('color',            settings.buttonColor);
                sm.addStyle('font-weight',      settings.buttonFontWeight);
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
                var $buttons = $([$modalButtonLeft[0], $modalButtonRight[0], $modalButtonClose[0]]);

                // insert elements
                $modalBg.append(
                    $modalPos.append(
                        $modalWindow.append(
                            $modalImg,
                            $modalInfo.append(
                                $modalNumber,
                                $modalButtons.append(
                                    $modalButtonLeft.text('<<'),
                                    $modalButtonClose.text('X'),
                                    $modalButtonRight.text('>>')
                                ),
                                $modalCaption
                            )
                        )
                    )
                );

                $wrapper.after($modalBg);

                // style modal background
                style($modalBg, [
                    ['background', settings.modalBackground],
                    ['position',   'fixed'],
                    ['z-index',    '100'],
                    ['height',     '100%'],
                    ['width',      '100%'],
                    ['top',        '0'],
                    ['left',       '0'],
                    ['display',    'none'],
                ]);

                // style modal positioning div
                style($modalPos, [
                    ['display',        'table-cell'],
                    ['height',         '100%'],
                    ['vertical-align', 'middle'],
                    ['text-align',     'center'],
                ]);

                // style modal window
                style($modalWindow, [
                    ['background', settings.modalWindowBackground],
                    ['border',     settings.modalWindowBorder],
                    ['margin',     '0 auto'],
                    ['display',    'inline-block'],
                ]);

                // style modal info
                $modalInfo.attr('style', 'position: relative');

                // style modal numbers
                style($modalNumber, [
                    ['font-size', settings.modalNumberFontSize],
                    ['color',     settings.modalNumberColor],
                    ['float',     'left'],
                    ['margin', '0 5px'],
                ]);

                // style modal caption
                style($modalCaption, [
                    ['font-weight',   settings.modalCaptionFontWeight],
                    ['font-size',     settings.modalCaptionFontSize],
                    ['color',         settings.modalCaptionColor],
                    ['line-height',   settings.modalCaptionLineHeight],
                    ['float',         'left'],
                    ['max-width',     '50px'],
                    ['white-space',   'nowrap'],
                    ['overflow',      'hidden'],
                    ['text-overflow', 'ellipsis'],
                ]);

                // style modal buttons
                style($modalButtons, [
                    ['position', 'absolute'],
                    ['right',    '0'],
                ]);

                style($buttons, [
                    ['background',  settings.modalButtonBackground],
                    ['color',       settings.modalButtonColor],
                    ['border',      settings.modalButtonBorder],
                    ['padding',     settings.modalButtonPadding],
                    ['font-weight', settings.modalButtonFontWeight],
                    ['margin',      settings.modalButtonMargin],
                    ['cursor',      'pointer'],
                ]);

                $buttons
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
        setUpSliderAndModal   = function () {
            var
                // sliding context
                currentShownImgIndex = 0,
                maxIndex             = $imgs.length - 1,
                currentShownImgSide  = 'left',
                slideCurrentVal      = 0,
                msBetweenSlides      = settings.secondsBetweenSlide * 1000,
                animIsInProgress     = false,

                // sliding functions
                animFinished = function () {
                    animIsInProgress = false;
                },
                slideLeft = function () {
                    var
                        // context
                        imgIndex = currentShownImgIndex,
                        imgLiWidth, $img,

                        // widths
                        imgSpace            = toValue(settings.imgSpace),
                        imgBorder           = toValue(settings.imgBorder),
                        fullyShownImgsWidth = 0,
                        slideWidth;

                    if (imgIndex === $imgs.length - 1) {
                        slideWidth = slideCurrentVal;
                        currentShownImgIndex = 0;
                    } else
                    if (currentShownImgSide === 'left') {
                        while (imgIndex <= maxIndex) {
                            $img = $imgs.eq(imgIndex);

                            imgLiWidth = $img.width() + imgBorder * 2 + imgSpace;

                            if (imgLiWidth + fullyShownImgsWidth - imgSpace > wrapperWidth) {
                                slideWidth = imgLiWidth + fullyShownImgsWidth - imgSpace - wrapperWidth;

                                currentShownImgIndex = imgIndex;

                                currentShownImgSide = 'right';

                                break;
                            }

                            fullyShownImgsWidth += imgLiWidth;

                            imgIndex++;
                        }
                    } else {
                        imgIndex++;

                        slideWidth = $imgs.eq(imgIndex).width() + imgBorder * 2 + imgSpace;

                        currentShownImgIndex = imgIndex;
                    }

                    slideCurrentVal -= slideWidth;

                    $imgList.animate({
                        marginLeft: slideCurrentVal,
                    }, 1000, animFinished);
                },
                slideRight = function () {
                    var
                        // context
                        imgIndex = currentShownImgIndex,
                        imgWidth, $img, i,

                        // widths
                        imgSpace            = toValue(settings.imgSpace),
                        imgBorder           = toValue(settings.imgBorder),
                        fullyShownImgsWidth = 0,
                        slideWidth          = 0;

                    if (currentShownImgSide === 'right') {
                        while (imgIndex >= 0) {
                            $img = $imgs.eq(imgIndex);

                            imgWidth = $img.width() + imgBorder * 2 + imgSpace;

                            if (imgWidth + fullyShownImgsWidth - imgSpace > wrapperWidth) {

                                for (i = 0; i < imgIndex; i++) {
                                    slideWidth -= $imgs.eq(i).width() + imgBorder * 2 + imgSpace;
                                }

                                currentShownImgIndex = imgIndex;

                                currentShownImgSide = 'left';

                                break;
                            }

                            fullyShownImgsWidth += imgWidth;

                            imgIndex--;
                        }
                    } else {
                        currentShownImgIndex = imgIndex - 1;

                        for (i = 0; i < currentShownImgIndex; i++) {
                            slideWidth -= $imgs.eq(i).width() + imgBorder * 2 + imgSpace;
                        }
                    }

                    slideCurrentVal = slideWidth;

                    $imgList.animate({
                        marginLeft: slideCurrentVal,
                    }, 1000, animFinished);
                },
                slideBack = function () {
                    slideCurrentVal = 0;

                    currentShownImgIndex = 0;

                    currentShownImgSide = 'left';

                    $imgList.animate({
                        marginLeft: slideCurrentVal,
                    }, 1000, animFinished);
                },
                slideFront = function () {
                    var imgSpace = toValue(settings.imgSpace);

                    slideCurrentVal = wrapperWidth - imgListWidth + imgSpace;

                    currentShownImgIndex = maxIndex;

                    currentShownImgSide = 'right';

                    $imgList.animate({
                        marginLeft: slideCurrentVal,
                    }, 1000, animFinished);
                },

                // timing context
                intervalId,

                // sliding events
                slideEvent = function () {
                    if (currentShownImgIndex === maxIndex) {
                        slideBack();
                    }
                    else {
                        slideLeft();
                    }
                },
                leftClicked = function () {
                    clearInterval(intervalId);

                    if (animIsInProgress) {
                        $imgList.finish();
                    }
                    else {
                        animIsInProgress = true;
                    }

                    if (currentShownImgIndex === 0) {
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
                        $imgList.finish();
                    }
                    else {
                        animIsInProgress = true;
                    }

                    if (currentShownImgIndex === maxIndex) {
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
                        imgText    = $img.attr('alt'),
                        imgRatio   = $img.attr('data-ratio'),
                        imgWidth   = modalImgWidth;

                    $modalImg.attr('src', imgSrc);
                    $modalImg.attr('alt', imgText);
                    $modalImg.attr('style', 'max-width: ' + imgWidth + 'px;');

                    if (imgRatio < modalImgMaxRatio) {
                        imgWidth *= imgRatio / modalImgMaxRatio;
                        $modalImg.attr('style', 'max-width: ' + imgWidth + 'px;');
                    }

                    $modalNumber.text((indexOfActiveImg + 1) + '/' +  $imgs.length);

                    $modalCaption.text(imgText);

                    sm.reset($modalBg.attr('style'));
                    sm.addStyle('display', 'table');
                    $modalBg.attr('style', sm.getStyle());

                    sm.reset($modalCaption.attr('style'));
                    sm.addStyle('max-width', imgWidth - $modalNumber.width() - $modalButtons.width() - 10 + 'px');
                    $modalCaption.attr('style', sm.getStyle());
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
            $modalButtonClose.click(closeModal);
            $modalWindow.click(modalWindowClicked);

            // and let the sliding begin
            intervalId = setInterval(slideEvent, msBetweenSlides);
        };

        settings = $.extend({}, defaultSettings, settings);

        waitUntilImagesLoaded(function () {
            calculation();

            domCreation();

            setUpSliderAndModal();
        });
    };

    // ONLY FOR TEST
    return {
        StyleMaker: StyleMaker,
    };
}));
