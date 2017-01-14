//IGNORE THIS FILE, it is used to test requirejs, implement with your own requirejs main
require(['./Gallery-Wall', './Gallery-Wall-fullscreen'], (GalleryWall, GalleryWallFullscreen) => {
  var gallery = new GalleryWall(document.getElementById("TEST"))
  gallery.init();
  
  var fullscreen = new GalleryWallFullscreen(document.getElementById("TEST")); // only instantiate one
  fullscreen.init();

});
