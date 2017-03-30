/*******************************************************************************
 *
 *  AMD, commonjs, global wrapper
 *
 *    This is a wrapper that is used to ensure that the library can be loaded
 *    using the AMD method (require.js) what I am using to build and test this.
 *    The commonjs format, which should allow this program to work with node.js
 *    and the global method, which should let it work with the vanilla browser.
 *
 ******************************************************************************/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['dragscroll'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./dragscroll'));
    } else {
        // Browser globals (root is window)
        root.GalleryWallCollection = factory(root.dragscroll);
    }
}(this, function(Dragscroll) {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.

    /*******************************************************************************
     *
     *  CLASS
     *    CLASS_INFO
     *
     *    Variables:  {Array}   collections  (the collection elements to manage)
     *                {Object}  options      (options object for configuration)
     *                {Object}  gallery      (used to hook manage gallery wall)
     *
     *    Functions:  {NONE}  init()             (initiate the class)
     *                {NONE}  openCollection()   (open the collection)
     *                {NONE}  closeCollection()  (close the collection)
     *                {NONE}  buildCollection()  (build the collection)
     *                {Bool}  hasClass()         (checks for class name)
     *                {NONE}  addClass()         (add class to element)
     *
     ******************************************************************************/
    return function GalleryWallCollection(options) {

        this.collections = [];

        this.gallery = {
            active: false
        };

        if (options.fullscreen && options.gallery) {
            console.log("Gallery wall collection instantiated with fullscreen & gallery wall");
        } else if (options.fullscreen) {
            console.log("Gallery wall collection instantiated with fullscreen");
        } else if (options.gallery) {
            console.log("Gallery wall collection instantiated with gallery wall");
        } else {
            console.log("Gallery wall collection instantiated");
        }

        /**
         * Used to merge two objects
         * @param  {Object} target The object to merge into
         * @param  {Object} source The object to merge with
         * @return {Object}        The merged object
         */
        this.merge = (target, source) => {
            if (typeof target !== 'object') {
                target = {};
            }
            for (var property in source) {
                if (source.hasOwnProperty(property)) {
                    var sourceProperty = source[property];
                    if (typeof sourceProperty === 'object') {
                        target[property] = this.merge(target[property], sourceProperty);
                        continue;
                    }
                    target[property] = sourceProperty;
                }
            }
            for (var a = 2, l = arguments.length; a < l; a++) {
                this.merge(target, arguments[a]);
            }
            return target;
        };

        this.options = {
            img_path: 'lib/icons'
        };

        if (options) {
            this.options = this.merge(this.options, options);
        }

        /*
         *  init()
         *    Used to initiate the class and setup the collection
         *
         *    Input(s):  {NONE}
         *
         *    Output(s): {NONE}
         */
        this.init = () => {
            var collectionsTMP = document.getElementsByClassName('gallery-wall-collection');
            var n = 0;
            for (var i of collectionsTMP) {
                this.collections.push({collection: []});

                for (var j of i.children) {
                    this.collections[n].collection.push({src: j.src, elem: j});

                }

                let e = n;
                i.onclick = () => {
                    this.openCollection(e);

                }
                n++;

            }
            for (var i of document.getElementsByClassName('gallery-wall-collection')) {
                var division = i.children.length;
                if (division > 4)
                    division = 4;
                var width = i.offsetWidth;
                for (var j = 0; j < i.children.length; j++) {
                    if (i.children[j].tagName == "IMG") {
                        var div = document.createElement("div");

                        div.appendChild(i.children[j]);
                        div.appendChild(document.createElement("div"));
                        div.className = "gallery-wall-collection-div-image";

                        i.appendChild(div);
                        j--;

                    }

                }
                for (var j = 0; j < i.children.length; j++) {
                    if (i.children[j].tagName == "IMG") {
                        i.removeChild(i.children[j]);
                        j--;

                    } else if (i.children[j].tagName == "DIV") {
                        if (j > 4)
                            i.children[j].style.width = "0px";
                        else
                            i.children[j].style.width = width / division + "px";

                    }

                }
                var name = "";
                if(i.getAttribute("data-name")) name = i.getAttribute("data-name");
                var h4 = document.createElement('h4');
                h4.className = "gallery-wall-collection-info-name";

                h4.innerHTML = name;

                var div = document.createElement('div');
                div.className = "gallery-wall-colleciton-div-info";

                var div2 = document.createElement('div');
                div2.className = "gallery-wall-collection-div-info-inner";
                div2.appendChild(h4);
                div.appendChild(div2);
                i.appendChild(div);

            }
            this.buildCollection();

        };

        /*
         *  openCollection()
         *    Used to open the collection
         *
         *    Input(s):  {Int} index (the index of the collection)
         *
         *    Output(s): {NONE}
         */
        this.openCollection = (index) => {
            this.collectionContainer.style.visibility = "visible";
            if(this.options.galleryWall){
                for(var i of this.collections[index].collection){
                    var name = null,
                        fstop = null,
                        speed = null,
                        focal = null,
                        make = null,
                        model = null,
                        iso = null,
                        by = null;
                    var img = document.createElement("img");
                    img.src = i.src;
                    this.collection.appendChild(img);

                    if(i.elem.getAttribute("data-f")) fstop = i.elem.getAttribute("data-f");
                    if(i.elem.getAttribute("data-tv")) speed = i.elem.getAttribute("data-tv");
                    if(i.elem.getAttribute("data-focal")) focal = i.elem.getAttribute("data-focal");
                    if(i.elem.getAttribute("data-make")) make = i.elem.getAttribute("data-make");
                    if(i.elem.getAttribute("data-model")) model = i.elem.getAttribute("data-model");
                    if(i.elem.getAttribute("data-iso")) iso = i.elem.getAttribute("data-iso");
                    if(i.elem.getAttribute("data-by")) by = i.elem.getAttribute("data-by");

                    img.setAttribute("data-f", fstop);
                    img.setAttribute("data-tv", speed);
                    img.setAttribute("data-focal", focal);
                    img.setAttribute("data-make", make);
                    img.setAttribute("data-model", model);
                    img.setAttribute("data-iso", iso);
                    img.setAttribute("data-by", by);
                }
                this.gallery = {
                    active: true,
                    gallery: new this.options.galleryWall(this.collection, {
                        imageHeight: 350,
                        margin: 8,
                        minWidth: 275, //minWidth <= imageHeight (less than or equal to)
                        imageWidth: 350
                    })
                }

            } else {
                for (var i of this.collections[index].collection) {
                    var name = null,
                        fstop = null,
                        speed = null,
                        focal = null,
                        make = null,
                        model = null,
                        iso = null,
                        by = null;
                    var div = document.createElement("div");
                    img.src = i.src;

                    if(i.elem.getAttribute("data-f")) fstop = i.elem.getAttribute("data-f");
                    if(i.elem.getAttribute("data-tv")) speed = i.elem.getAttribute("data-tv");
                    if(i.elem.getAttribute("data-focal")) focal = i.elem.getAttribute("data-focal");
                    if(i.elem.getAttribute("data-make")) make = i.elem.getAttribute("data-make");
                    if(i.elem.getAttribute("data-model")) model = i.elem.getAttribute("data-model");
                    if(i.elem.getAttribute("data-iso")) iso = i.elem.getAttribute("data-iso");
                    if(i.elem.getAttribute("data-by")) by = i.elem.getAttribute("data-by");

                    img.setAttribute("data-f", fstop);
                    img.setAttribute("data-tv", speed);
                    img.setAttribute("data-focal", focal);
                    img.setAttribute("data-make", make);
                    img.setAttribute("data-model", model);
                    img.setAttribute("data-iso", iso);
                    img.setAttribute("data-by", by);

                    div.appendChild(img);
                    div.appendChild(document.createElement("div"));
                    this.collection.appendChild(div);

                }
                var width = (this.collection.offsetWidth / 4) - 32;

                for (var i of this.collection.children) {
                    i.style.width = width + "px";
                    // i.style.height = width - 20 + "px";
                    if (i.firstChild.offsetWidth < i.firstChild.offsetHeight) {
                        i.firstChild.style.width = "100%";
                        i.firstChild.style.height = "auto";

                    }

                }

            }
            if (this.options.fullscreen) {
                this.index = this.options.fullscreen.add(this.collection);

            }

        };

        /*
         *  closeCollection()
         *    Used to close the ccurrently open collection
         *
         *    Input(s):  {NONE}
         *
         *    Output(s): {NONE}
         */
        this.closeCollection = () => {
            this.collectionContainer.style.visibility = "hidden";
            if(this.gallery.active){
                delete this.gallery.gallery;
            }

            while (this.collection.firstChild) {
                this.collection.removeChild(this.collection.firstChild);

            }
            if (this.options.fullscreen && this.index) {
                this.options.fullscreen.remove(this.index);
                delete this.index;

            }

        };

        /*
         *  buildCollection()
         *    Used to build the collection window
         *
         *    Input(s):  {NONE}
         *
         *    Output(s): {NONE}
         */
        this.buildCollection = () => {
            var collection = document.getElementById("gallery-wall-collection-container");

            var div1 = document.createElement("div");
            div1.id = "gallery-wall-collection-images";
            if(this.options.galleryWall){
                div1.className = "gallery-wall";
            }

            var div2 = document.createElement("div");
            div2.id = "gallery-wall-collection-close";

            var img = document.createElement("img");
            img.src = this.options.img_path + "/close.svg";
            div2.appendChild(img);

            div2.onclick = () => {
                this.closeCollection();

            };

            collection.appendChild(div1);
            collection.appendChild(div2);

            this.collection = div1;
            this.collectionContainer = document.getElementById("gallery-wall-collection-container");
            this.addClass(this.collection, "dragscroll");
            Dragscroll.reset();

        };

        /*
         *  hasClass()
         *    Used to check element to see it has the class name
         *
         *    Input(s):  {DOM}    elem      (the element to check)
         *               {String} className (the name to check)
         *
         *    Output(s): {Bool} (true/false element has class name)
         */
        this.hasClass = (elem, className) => {
            if (elem.classList) {
                return elem.classList.contains(className);
            } else if (elem.className) {
                return !!elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            } else {
                return false;
            }

        };

        /*
         *  addClass()
         *    Used to add a class name to the element
         *
         *    Input(s):  {DOM}    elem      (the element to add to)
         *               {String} className (the name to add)
         *
         *    Output(s): {NONE}
         */
        this.addClass = (elem, className) => {
            if (elem.classList) {
                elem.classList.add(className);
            } else if (!this.hasClass(elem, className))
                elem.className += " " + className;

            };

        this.init();

    };

}));
