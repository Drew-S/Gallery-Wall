# Gallery Wall

Gallery Wall is a javascript gallery system for the web. It comes with two modules, both are optional and work independently of one another.

### Features
-   Gallery wall (auto resizes with screen)
-   Mobile support (partially, left over from old build, may work, may not)
-   Multiple Gallery(s) (albums)
-   Fullscreen mode

### Libraries used

I used the __velocity.js__ and the __dragscroll.js__ libraries for parts of the fullscreen module.

[Dragscroll](https://github.com/asvd/dragscroll) and [Velocity](https://github.com/julianshapiro/velocity)

### Installation
Download or clone, and copy the `src/` contents into your `scripts` folder:

Less files are also provided, as they are what I develop in, feel free to use those instead of css files.

```
root
|--- css
|    |--- gallery-wall.css
|    |--- gallery-wall-fullscreen.css
|
|--- scripts
|    |--- Gallery-Wall.js
|    |--- gallery-wall-fullscreen.js
|    |--- velocity.js
|
|--- imgs
|    |--- close.svg
|    |--- left.svg
|    |--- right.svg
|
|...
```

Images may not work if they do not have the same folder hierarchy. `src/imgs/` in the fullscreen module, you will have the edit the appropriate line of code. I will add a config section that can fix this issue later.

### Usage

If your using a vanilla browser, you can use the script directly:

#### Setting up the script(s)

**NOTE** The fullscreen module requires the use of velocity.js, make sure to load that script before fullscreen.

```html
<script type="text/javascript" src="path/to/Gallery-Wall.js"></script>
<script type="text/javascript" src="path/to/velocity.js"></script>
<script type="text/javascript" src="path/to/Gallery-Wall-fullscreen.js"></script>
```

You can also use the script using the **AMD** standard, with **require.js:**

You need not add velocity to these lists as the Fullscreen module calls on velocity as a dependency that will work without calling velocity its self here, however, the velocity script, must be in the same directory as the fullscreen module.

```javascript
requirejs(['/path/to/Gallery-Wall', '/path/to/Gallery-Wall-fullscreen'], (GalleryWall, GalleryWallFullscreen) => {

});
```

And you can use it with **common.js:**

```javascript
var GalleryWall = require('/path/to/Gallery-Wall');
var GalleryWallFullscreen = require('/path/to/Gallery-Wall-fullscreen');
```

#### Setting up the images

Inside your html file fill in a div with your images like so:

```html
<div id="some-gallery" class="gallery-wall">
  <img src="image1.png" />
  <img src="image2.png" />
  ...
</div>
```
The class has to be set as shown.

You can file this element out however you like, I have used a `PHP` script that read a directory of images into img elements tossing them into the div.

#### Running init()

**Important:** If you are using both the _Gallery-Wall_ module and the _Gallery-Wall-fullscreen_ you must load Gallery-Wall before fullscreen:

Now that everything is setup you start the system like so:

```javascript
var gallery = new GalleryWall(document.getElementById('some-gallery'));
gallery.init();

var fullscreen = new GalleryWallFullscreen(document.getElementById('some-gallery'));
fullscreen.init()
```

**ONLY** one fullscreen instantiation is required for the program, any more and it may cause problems. Fullscreen is designed to operate as a singleton managing fullscreen, while gallery is an object that manages its own gallery.

_this is called inside requirejs, after require in commonjs, or after the script has been set in vanilla browser_

### Known issues

Due to the nature of the script having a `min-width` for the images, if the browser
or the gallery container is too small (width) images will not shrink below the
`min-width` causing empty space to the right of images.

You can remove this limitation by setting `min-width` to `0` just be aware that
your images can have very low (1 or 2px wide) where your images basically do not
show.

It is best to play with the containers size and the `min-width` to get the images
to a point you like

### Tested on Manjaro Linux (browsers)
-   Vivaldi (chrome)

### License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

### Author
Drew Sommer
