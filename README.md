# Gallery Wall

**NOTICE**

I got to be honest, this system was not developed vary well. It works but is messy. I would recomend using a different system, thanks. I am working on updating this system, but because of the mess, and what I want to accomplish with it I will have to be making it from scratch. That being said I hope to develop a cleaner system. One that will be easier and more modular.

Gallery Wall is a simple to use gallery system that you can add to your website
that aligns images (near) perfectly horizontally, and has a fullscreen image viewer.

### Features
-   Gallery wall (auto resizes with screen)
-   Mobile support
-   Multiple Gallery(s) (albums)

### Installation
Download or clone, and copy the `src/` contents into your `scripts` folder:

```
root
|--- css
|    |--- gallery-wall.css
|
|--- scripts
|    |--- Gallery-Wall.js
|
|...
```
### Usage

If your using a vanilla browser, you can use the script directly:

#### Setting up the script

```html
<script type="text/javascript" src="path/to/Gallery-Wall.js"></script>
```

You can also use the script using the **AMD** standard, with **require.js:**

```javascript
requirejs(['/path/to/Gallery-Wall'], (GalleryWall) => {

});
```

And you can use it with **common.js:**

```javascript
var GalleryWall = require('/path/to/Gallery-Wall');
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

Now that everything is setup you start the system like so:

```javascript
var gallery = new GalleryWall(document.getElementById('some-gallery'));
gallery.init();
```

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
