(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./lib/Gallery-Wall'], function (GalleryWall) {
            return (root.returnExportsGlobal = factory(GalleryWall));
        });
        define(['./lib/Gallery-Wall-fullscreen'], function (GalleryWallFullscreen) {
            return (root.returnExportsGlobal = factory(GalleryWallFullscreen));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./lib/Gallery-Wall'));
        module.exports = factory(require('./lib/Gallery-Wall-fullscreen'));
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root.GalleryWall);
        root.returnExportsGlobal = factory(root.GalleryWallFullscreen);
    }
}(this, function(GalleryWall, GalleryWallFullscreen){
    return GalleryWall, GalleryWallFullscreen;
}));
