# Gallery Wall v2.4.1

Gallery wall is a front end javascript gallery system built with 3 modules to provide a beautify gallery.

![Gallery Wall preview](docs/preview/Gallery-Wall.png)

## Modules

The three modules provided are '**Gallery-Wall**', '**Gallery-Wall-fullscreen**', and '**Gallery-Wall-collection**'.

Each of these 3 modules operate independentally from one or in conjunction with each other. They mesh well with each other to complete a full gallery system.

## HTML structure

The html file needs to be setup with css links and have a structure for the gallery.

You need to include the corrosponding _.css_ to the module your using.

```html
<link rel="stylesheet" type="text/css" href="lib/css/gallery-wall.css">
<link rel="stylesheet" type="text/css" href="lib/css/gallery-wall-fullscreen.css">
<link rel="stylesheet" type="text/css" href="lib/css/gallery-wall-collection.css">
```

If can use _requirejs_, _AMD modules_, _commonjs_, or plain _HTML_. Link accordingly

### HTML

```html
<script type="text/javascript" src="lib/Gallery-Wall.js"></script>
<script type="text/javascript" src="lib/Gallery-Wall-collection.js"></script>
<script type="text/javascript" src="lib/Gallery-Wall-fullscreen.js"></script>
```

### AMD and requirejs

```html
<script type="text/javascript" data-main="mainfile" src="requirejs"></script>
```

```javascript
require(['lib/Gallery-Wall', 'lib/Gallery-Wall-collection', 'lib/Gallery-Wall-fullscreen'], (GalleryWall, GalleryWallCollection, GalleryWallFullscreen) => {
    // do something...
});
```

### commonjs

```javascript
const GalleryWall           = require('Gallery-Wall');
const GalleryWallCollection = require('Gallery-Wall-collection');
const GalleryWallFullscreen = require('Gallery-Wall-fullscreen');
```

### HTML image structure

The html gallery needs to be setup like so:

```html
<div class="gallery-wall">
    <img>
    <img>
    <img>
    ...
    <!-- If your using collection module -->
    <div class="gallery-wall-collection">
        <img>
        <img>
        <img>
        ...
    </div>
</div>
<!-- If your using the fullscreen module -->
<div id="gallery-wall-fullscreen">

</div>
<!-- If your using collection module -->
<div id="gallery-wall-collection-container">

</div>
<div>
```

Each of the images and collections can also take on info data. Inside the `<img>` or `<div>` tags include any or all the data objects like so:

```html
<img data-name="title" />
```

- `data-name` The name of the image
- `data-by` The author
- `data-f` The fstop or aperture
- `data-tv` The shutter speed
- `data-focal` The focal length
- `data-iso` The iso
- `data-make` The maker of the camera (canon, nikon, etc.)
- `data-model` The model of camera (T3i, 60D, etc.)

--------------------------------------------------------------------------------

## Modules

### Gallery Wall

**GalleryWall(elem, [options])**

pass the gallery div for the script to manage and the options:

```javascript
var gallery = new GalleryWall(document.getElementById('elem'), {/*options*/});
```

#### options

You can also change these options using `gallery.config();`.

```javascript
gallery.config({
    imageHeight: 300,
    margin: 8,
    minWidth: 200,  //minWidth <= imageHeight (less than or equal to)
    exif: true,
    author: true,
    title: true
});
```

- `imageHeight` the height of the images in 'px'
- `margin` the margins of the images in 'px'
- `minWidth` the minimum width each image should be in 'px' (ignores images smaller than minimum) (should be less than or equal to the `imageHeight`)
- `exif` boolean toggle whether or not to show exif info (ISO, apeture, shutterspeed, etc.)
- `author` boolean toggle whether or not to show author info
- `title` boolean toggle whether or not to show image title

--------------------------------------------------------------------------------

### Fullscreen

**GalleryWallFullscreen(...elem, [options])**

pass the gallery div, same as the gallery wall module:

```javascript
var fullscreen = new GalleryWallFullscreen(document.getElementById('elem'), {/*options*/});
```

or mutliple galleries:

```javascript
var fullscreen = new GalleryWAllFullscreen(document.getElementById('elem1'), document.getElementById('elem1'));
```

You can change the options using `fullscreen.config()`, default values:

#### options

```javascript
fullscreen.config({
    img_path: 'lib/icons',
    exif: true,
    author: true,
    title: true
})
```

--------------------------------------------------------------------------------

### Collection

**GalleryWallCollection([options])**

Collection can be instantiated with no options and will work. You may need to change the image path like the fullscreen module:

```javascript
var collections =  new GalleryWallCollection({/*options*/});
```

#### options

defaults:

```javascript
GalleryWallCollection({
    img_pathL  : "lib/icons"
})
```

If you are using the fullscreen module pass the fullscreen variable:

```javascript
var fullscreen = new GalleryWallFullscreen(...);

var collections = new GalleryWallCollection({
    fullscreen: fullscreen
});
```

If you are using the gallery wall module, pass the GalleryWall module:

```javascript
var collections = new GalleryWallCollection({
    galleryWall: GalleryWall
});
```

# License

MIT License

Copyright (c) 2016 Drew

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
