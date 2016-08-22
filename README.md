Easy Carousel
===================

Image slideshow and carousel plugin for jQuery. You target the wrapper where the images are. Everything will be removed inside the wrapper, and the plugin will build its own DOM.

Features
-------------
  - The design is completely customizable with parameters.
  - Easy to use, you dont need to add any parameters since everything has a default value (see below).
  - Define the number of the visible images.
  - You can control the time between sliding.
  - Modal and lightbox funvtionality (you can switch between images in the modal window as well).
  - The alt text of the image will be caption in the modal window.

Examples
-------------
*Task:* We have 10 images, but we want to display only 5 at once with 200px width and slide them every 5 seconds.

```
...
<div id='images'>
    <img src="imgs/1.jpg" alt="First image" />
    <img src="imgs/2.jpg" alt="Second image" />
    <img src="imgs/3.jpg" alt="Third image" />
    <img src="imgs/4.jpg" alt="Fourth image" />
    <img src="imgs/5.jpg" alt="Fifth image" />
    <img src="imgs/6.jpg" alt="Sixth image" />
    <img src="imgs/7.jpg" alt="Seventh image" />
    <img src="imgs/8.jpg" alt="Eighth image" />
    <img src="imgs/9.jpg" alt="Ninth image" />
    <img src="imgs/10.jpg" alt="Tenth image" />
</div>
...
<script>
    $("#images").easyCarousel({
        imgWidth:           '200px',
        visibleImgCount:     5,
        secondsBetweenSlide: 5
    });
</script>
...
```
*More examples are coming.*

## Parameters

*The parameter names are self explanatory most of the time. I made a list about the html elements which the rules apply to.*

### Behavioral Parameters

**visibleImgCount:** Number of the items visible at once in the slider.  
*Default:*  `3`

**secondsBetweenSlide:** Time between 2 slide in seconds.  
*Default:*  `3`

### Slider Style Parameters

*wrapper:* This is the most outer wrapper of the slider. It is targeted by jQuery when the plugin initialized.

**wrapperBorder:**  
*Default:*  `'1px solid gray'`

**wrapperPadding:**  
*Default:*  `'10px'`

**wrapperBackground:**  
*Default:*  `'black'`

**imgWidth:**  
*Note:* The current width can be smaller if the image cannot be display within the maximum height (next param).  
*Default:*  `'300px'`

**imgMaxHeight:**  
*Default:*  `'150px'`

**imgSpace:**  
*Default:*  `'10px'`

**imgBorder:**  
*Default:*  `'5px solid white'`

**buttonWidth:**  
*Default:*  `'50px'`

**buttonHeight:**  
*Default:*  `'25px'`

**buttonBorder:**  
*Default:*  `'1px solid #bbb'`

**buttonBackground:**  
*Default:*  `'rgba(255, 255, 255, 0.6)'`

**buttonHoverBackground:**  
*Default:*  `'white'`

**buttonHoverBorder:**  
*Default:*  `'1px solid #bbb'`

### Modal Style Parameters

*modal:* This is the background behind the modal window. Usually dark transparent.  
*modalWindow:* This is the actual "window" which pops up.  
*modalNumber:* The "current img number/number of images" wrapper.  
*modalCaption:* The alt text of the image shown here.  
*modalButton:* The three button (<< X >>) in the modal window.  

**modalBackground:**   
*Default:*  `'rgba(0, 0, 0, 0.8)'`

**modalWindowBackground:**   
*Default:*  `'white'`

**modalWindowBorder:**   
*Default:*  `'1px solid white'`

**modalNumberFontSize:**   
*Default:*  `'24px'`

**modalNumberColor:**   
*Default:*  `'#333'`

**modalCaptionFontSize:**   
*Default:*  `'20px'`

**modalCaptionColor:**   
*Default:*  `'#666'`

**modalCaptionFontWeight:**   
*Default:*  `'bold'`

**modalCaptionLineHeight:**   
*Default:*  `'30px'`

**modalButtonBackground:**   
*Default:*  `'transparent'`

**modalButtonHoverBackground:**   
*Default:*  `'#666'`

**modalButtonColor:**   
*Default:*  `'#333'`

**modalButtonHoverColor:**   
*Default:*  `'white'`

**modalButtonBorder:**   
*Default:*  `'1px solid #333'`

**modalButtonHoverBorder:**   
*Default:*  `'1px solid #333'`

**modalButtonPadding:**   
*Default:*  `'3px 7px'`

**modalButtonMargin:**   
*Default:*  `'0 10px'`

**modalButtonFontWeight:**   
*Default:*  `'bold'`


### License: GPL2
