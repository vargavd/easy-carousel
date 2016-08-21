Easy Carousel
===================

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

Parameters
-------------

####  wrapperBorder
The border css rule for the wrapper (which you select with jQuery).
*Default:*  **1px solid gray**

####  wrapperPadding
Wrapper padding.
*Default:*  **10px**

####  wrapperBackground
Background css rule for wrapper.
*Default:*  **black**

####  imgWidth
Image width in the carousel. 
*Note: The current width can be smaller if the image cannot be display within the maximum height (next param).*
*Default:*  **300px**

####  imgMaxHeight
Maximum image height in the carousel.
*Default:*  **150px**

####  imgSpace
Space between the images in the carousel.
*Default:*  **10px**

*** More parameters are coming ***


### License: GPL2
