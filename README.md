# Gallery Wall

Gallery Wall is a simple to use gallery system that you can add to your website
that aligns images (near) perfectly horizontally, and has a fullscreen image viewer.

[Live preview of the site](https://drew-s.github.io/Gallery-Wall/index.html)

###### Features
-   Gallery wall (auto resizes with screen)
-   Fullscreen mode (with smooth animations)
-   Mobile support
-   Mobile fullscreen mode
-   Multiple Gallery(s) (albums)

### Installation
Download or clone, and copy the `src/` contents into your `scripts` folder:

```
├── root/
|    ├── scripts/
|    |    ├── gallery.js
|    |    |    ├──imgs/
|    |    ├── ...
|    ├── ...
├── ...  
```
### Usage
Inside your `.html` / `.php` file add:

```html
<script type="text/javascript" src="path/to/gallery.js"></script>
```

to your `<head></head>`

```html
<head>
  <title></title>
  <meta content="">
  <script type="text/javascript" src="path/to/gallery.js"></script>
</head>
```

Inside your body create a container `<div class="gallery"></div>` (div only used as example) with the class
'gallery' and inside that place your images `<img></img>` ...

The script will take care of the rest.

### Known issues
Due to the nature of the script having a `min-width` for the images, if the browser
or the gallery container is too small (width) images will not shrink below the
`min-width` causing empty space to the right of images.

You can remove this limitation by setting `min-width` to `0` just be aware that
your images can have very low (1 or 2px wide) where your images basically do not
show.

It is best to play with the containers size and the `min-width` to get the images
to a point you like

####### tested on Manjaro Linux(browsers):
-   Vivaldi (chrome)
-   Opera
-   Firefox

### License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

### Author
Drew Sommer

### Preview
__None of the images used to show the gallery are owned or claimed to be owned by the auhtor.__

_Images were retreived from [deviant art] (http://www.deviantart.com/browse/all/resources/)_

![preview][pre]

##### Fullscreen
![fullscreen][full]

##### Mobile
![Mobile][mob]

##### Mobile Fullscreen
![Mobile Fullscreen][mobfull]

[pre]: ./preview/Preview.png
[full]: ./preview/Fullscreen.png
[mob]: ./preview/Mobile.png
[mobfull]: ./preview/MobileFullscreen.png
