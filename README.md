# Gallery Wall

Gallery Wall is a Client Side gallery system built using a modular design. Each module is designed to be self contained and are not dependent on each other.

The primary script `Gallery-Wall.js` is the main focuse, providing a way to align images perfectly in any window. Images are aligned in a "text justify" way with exact margins in between providing a nice interface.

## Usage

Download and unpack the scripts into your working directory. From `src`.

Load the modules of your choosing:

##### Vanilla

```html
<script src="path/to/Gallery-Wall.js"></script>
```

If you are using the vanilla method, Fullscreen requires the use of the `dragscroll.js` and `velocity.js` files, make sure to load them first.

```html
<script src="path/to/dragscroll.js"></script>
<script src="path/to/velocity.js"></script>
<script src="path/to/Gallery-Wall-fullscreen.js"></script>
```

##### AMD

```javascript
require(['path/to/Gallery-Wall'], (GalleryWall) => {});
```

##### CommonJS

```javascript
const GalleryWall = require('path/to/Gallery-Wall');
```

### Link the css files

```html
<link href="path/to/gallery-wall.css" />
```

Or if you would like I have the styles available in .less files.

### Then setup your gallery

##### GalleryWall

```javascript
var elem = document.getElementById('Gallery');
var gallery = new GalleryWall(elem); // optional

var fullscreen = new GalleryWallFullscreen(elem); // optional

var collection = new GalleryWallCollection(fullscreen); // optional
```

### Have your images setup like so for Gallery Wall

```html
<div class="gallery-wall">
  <img />
  <img />
  <div>
    ...
  </div>
  ...
</div>
```

Make sure to have the class `gallery-wall` attached to the div.

If your using the collection module the div needs to have the class:
`gallery-wall-collection`

```html
<div class="gallery-wall-collecion">
  <img>
  <img>
</div>
```

Currently the collection module only supports a single nesting level.

## Libraries

The development of this system used the libraries of a few users.

[(UMD) Universal Module Defininition](https://github.com/umdjs/umd): All the different modules are wrapped in a UMD module template for compatibility with __commonjs__, __AMD__ and __requirejs__, and vanilla browser.

[Velocity](https://github.com/julianshapiro/velocity): Velocity js is used to handle animations on the project, providing smooth animations for the system. __Author:__ Julian Shapiro

[Dragscroll](https://github.com/asvd/dragscroll): Dragscroll is used to enable drag features for the different elements. __Author:__ asvd
