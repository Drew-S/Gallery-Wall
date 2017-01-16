# Gallery Wall Fullscreen API

Can be used on its own or with the other modules.

__ONLY INSTANTIATE ONCE__

## Javascript

### AMD

```javascript
require(['path/to/Gallery-Wall-fullscreen'], (GalleryWallFullscreen) => {
  var elem = document.getElementById('gallery');
  var elem2 = document.getElementById('gallery2');

  var fullscreen = new GalleryWallFullscreen(elem, elem2);

});
```

### CommonJS

```javascript
const GalleryWallFullscreen = require('path/to/Galler-Wall-fullscreen');

var elem = document.getElementById('gallery');
var elem2 = document.getElementById('gallery2');

var fullscreen = new GalleryWallFullscreen(elem, elem2);

```

### Vanilla

```html
<script src="path/to/velocity.js"></script>
<script src="path/to/dragscroll.js"></script>
<script src="path/to/Gallery-Wall-fullscren.js"></script>
```

Make sure to load velocity and dragscroll first!

```javascript
var elem = document.getElementById('gallery');
var elem2 = document.getElementById('gallery2');

var fullscreen = new GalleryWallFullscreen(elem, elem2);
```

Make sure that `velocity.js` and `dragscroll.js` are in the same directory as `Gallery-Wall-fullscreen.js`

If your using Fullscreen with Gallery Wall make sure that you run GalleryWall first, and then pass the same elem passed to gallerty wall to Fullscreen.
