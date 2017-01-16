# Gallery Wall API

## HTML

Setup your images inside a div container with the class `gallery-wall` on it, an id is also recomended.

```html
<div id="gallery" class="gallery-wall">
  <img>
  <img>
  <img>
  <div class="gallery-wall-collection"> /* optional */
    <img>
  </div>
  ...
</div>
```

## Javascript

### AMD

```javascript
require(['path/to/Gallery-Wall'], (GalleryWall) => {
  var elem = document.getElementById('gallery');

  var gallery = new GalleryWall(elem);

});
```

### CommonJS

```javascript
const GalleryWall = require('path/to/Gallery-Wall');

var elem = document.getElementById('gallery');

var gallery = new GalleryWall(elem);
```

I would recommend against using Vanilla, AMD and commonjs are better. With AMD being the prefered method.

### Vanilla

```html
<script src="path/to/Gallery-Wall.js"></script>
```

```javascript
var elem = document.getElementById('gallery');

var gallery = new GalleryWall(elem);
```

If your also using fullscreen, pass the `elem` that is given to GalleryWall to fullscreen as well
