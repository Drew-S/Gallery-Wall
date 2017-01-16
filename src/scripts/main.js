//IGNORE THIS FILE, it is used to test requirejs, implement with your own requirejs main
require(['./Gallery-Wall', './Gallery-Wall-fullscreen', './Gallery-Wall-collection'], (GalleryWall, GalleryWallFullscreen, GalleryWallCollection) => {
  var gallery = new GalleryWall(document.getElementById("TEST"))

  var fullscreen = new GalleryWallFullscreen(document.getElementById("TEST")); // only instantiate one fullscreen

  var collection = new GalleryWallCollection(fullscreen); // only instantiate one

});
