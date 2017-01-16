# Gallery Wall Collection API

Can be used on its own or with the other modules.

__ONLY INSTANTIATE ONCE__

## HTML

```html
<div class="gallery-wall-collection">
  <img>
  <img>
  ...
</div>
```

## Javascript

### AMD

```javascript
require(['path/to/Gallery-Wall-collection'], (GalleryWallCollection) => {
  var collection = new GalleryWallCollection();

});
```

### CommonJs

```javascript
const GalleryWallCollection = require('path/to/Gallery-Wall-collection');

var collection = new GalleryWallCollection();
```

### Vanilla

```html
<script src="path/to/Gallery-Wall-collection.js"></script>
```

```javascript

var collection = new GalleryWallCollection();
```

__NOTE__ if you are using this with Gallery wall or fullscreen, load this last.

Make sure to pass fullscreen as an option to GalleryWallCollection on instantiation.

```javascript
var fullscreen = new GalleryWallFullscreen(elem);

var collection = new GalleryWallCollection(fullscreen);
```
