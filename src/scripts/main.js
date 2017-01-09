//IGNORE THIS FILE, it is used to test requirejs, implement with your own requirejs main
require(['./Gallery-Wall'], (GalleryWall) => {
  var gallery = new GalleryWall(document.getElementById("TEST"))
  gallery.init();

});
