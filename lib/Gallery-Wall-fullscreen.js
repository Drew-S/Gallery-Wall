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
        define([
            'velocity', 'dragscroll'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('velocity'), require('dragscroll'));
    } else {
        // Browser globals (root is window)
        root.GalleryWallFullscreen = factory(root.Velocity, root.dragscroll);
    }
}(this, function(Velocity, Dragscroll) {

    /*******************************************************************************
   *
   *  CLASS
   *    CLASS_INFO
   *
   *    Variables:  {DOM}    fullscreen  (the fullscreen element to create window)
   *                {Array}  galleries   (the galleries to manage)
   *                {Bool}   animte      (flag if animation in progress)
   *                {Bool}   open        (flag if fullscreen is open)
   *                {Int}    duration    (the duration of animation, in ms)
   *
   *    Functions:  {NONE}  moveMain()         (used to mange movement of the
   *                                            main image)
   *                {NONE}  indexManage()      (manage index mouse event)
   *                {NONE}  upMain()           (manage up mouse event)
   *                {NONE}  init()             (initiate system)
   *                {NONE}  buildFullscreen()  (build fullscreen elements)
   *                {NONE}  attach()           (attach click events)
   *                {Int}   add()              (add gallery to manager)
   *                {NONE}  remove()           (remove gallery from manager)
   *                {NONE}  openFullscreen()   (opens fullscreen)
   *                {NONE}  closeFullscreen()  (closes fullscreen)
   *                {NONE}  buildIndex()       (builds index for fullscreen)
   *                {Bool}  hasClass()         (checks elem for class)
   *                {NONE}  addClass()         (adds class to elem)
   *                {NONE}  removeClass()      (removes class from elem)
   *
   ******************************************************************************/
    return function GalleryWallFullscreen(...args) {
        this.fullscreen = document.getElementById('gallery-wall-fullscreen');

        this.galleries = [];
        this.animate = false;
        this.open = true;

        this.duration = 350;

        this.options = {
            img_path: 'lib/icons',
            exif: true,
            author: true,
            title: true
        }

        this.svg = {
            aperture: "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\"><path transform=\"scale(0.33)\" d=\"m23.99 1.5957a22.413 22.413 0 0 0 -13.459 4.5176l4.8535 15.053 12.75-19.17a22.413 22.413 0 0 0 -4.1445 -0.40039zm5.9375 0.82617l-8.5664 12.912 22.352-1.9336a22.413 22.413 0 0 0 -13.785 -10.979zm-20.832 4.877a22.413 22.413 0 0 0 -7.5137 16.646l14.635 5.5312-7.1211-22.178zm35.418 7.7676l-14.865 1.3027 15.141 15.945a22.413 22.413 0 0 0 1.6152 -8.3047 22.413 22.413 0 0 0 -1.8906 -8.9434zm-10.51 8.4297l-3.0273 21.781a22.413 22.413 0 0 0 13.039 -11.262l-10.012-10.52zm-32.342 2.3281a22.413 22.413 0 0 0 8.6191 15.881l12.953-7.6992-21.572-8.1816zm29.488 5.5195l-19.332 11.459a22.413 22.413 0 0 0 12.172 3.6191 22.413 22.413 0 0 0 5.1699 -0.63086l1.9902-14.447z\" fill=\"#ffffff\" style=\"paint-order:normal\"/></svg>",
            focal: "<svg width=\"16\" height=\"16\" xmlns=\"http://www.w3.org/2000/svg\"><path transform=\"scale(0.33)\" d=\"m42.168 1.0215c-0.41304 0-0.59233 0.11885-0.98047 0.27344-0.38815 0.15458-0.88147 0.37174-1.4727 0.64844-1.1824 0.5534-2.7552 1.3336-4.5898 2.2832-3.6693 1.8991-8.3819 4.4511-13.037 7.0703-4.6552 2.6192-9.2534 5.3076-12.699 7.4824-1.7229 1.0874-3.1533 2.0465-4.1758 2.8164-0.51124 0.38476-0.91483 0.72187-1.2188 1.0234-0.15196 0.1508-0.28237 0.28892-0.38867 0.44531-0.10631 0.1561-0.21289 0.32547-0.21289 0.625 0 0.3001 0.10659 0.46883 0.21289 0.625 0.1063 0.1561 0.23671 0.29627 0.38867 0.44727 0.30392 0.30161 0.70751 0.63658 1.2188 1.0215 1.0225 0.76985 2.4529 1.7309 4.1758 2.8184 3.4458 2.1749 8.044 4.8632 12.699 7.4824 4.6552 2.6192 9.3678 5.1693 13.037 7.0684 1.8346 0.94957 3.4075 1.7376 4.5898 2.291 0.59118 0.27666 1.0845 0.48834 1.4727 0.64258 0.38814 0.15458 0.56743 0.27344 0.98047 0.27344l-0.01172-3.5508c0.16785 0-2.1335-0.0389-2.4434-0.16211-0.30992-0.12321-0.73683-0.30498-1.2539-0.54688-1.0342-0.48401-2.4411-1.183-4.0762-2.0293-0.41088-0.21266-0.94027-0.50209-1.3789-0.73242 1.3899-1.1354 2.386-3.1156 3.1016-5.5117 0.91091-3.0503 1.3522-6.8148 1.3496-10.541-0.00263-3.7262-0.44355-7.4053-1.3496-10.291-0.45303-1.4428-1.0202-2.6875-1.7285-3.6465-0.39771-0.53842-0.85298-0.97715-1.3535-1.3086 0.43222-0.22676 0.95418-0.51294 1.3594-0.72266 1.635-0.84627 3.042-1.5453 4.0762-2.0293 0.51708-0.24189 0.94399-0.43151 1.2539-0.55469 0.30992-0.12321 2.6112-1.2246 2.4434-1.2246zm-11.256 8.1387 0.45312 0.10742c0.53242 0.1217 1.0767 0.55036 1.5879 1.3125 0.51118 0.7621 0.97131 1.8336 1.3496 3.1094 0.75659 2.5515 1.1881 5.9167 1.2266 9.3301 0.03846 3.4134-0.31824 6.8816-1.0938 9.6406-0.77551 2.759-1.9848 4.7533-3.4609 5.3887l-0.2207 0.09375c-1.9261-1.0312-3.9265-2.1236-6.0391-3.2988 1.6541-1.3762 2.799-5.8935 2.7988-11.043-0.0017-5.3478-1.2362-9.981-2.9746-11.164 2.2332-1.2428 4.348-2.395 6.373-3.4766zm-9.3496 5.1465c-1.0536 2.1265-1.686 5.6847-1.6875 9.4941 0.0017 3.6261 0.57543 7.0358 1.5469 9.1934-3.6867-2.0912-7.2793-4.1886-10.004-5.9082-1.5284-0.96469-2.7928-1.8138-3.6602-2.4668-0.43366-0.32655-0.77013-0.60766-0.97461-0.81055-0.052732-0.05216-0.069492-0.07712-0.10352-0.11719 0.034167-0.04044 0.050288-0.06623 0.10352-0.11914 0.20448-0.20296 0.54095-0.48602 0.97461-0.8125 0.86731-0.65303 2.1317-1.5002 3.6602-2.4648 2.7599-1.742 6.4069-3.8701 10.145-5.9883z\" color=\"#000000\" color-rendering=\"auto\" dominant-baseline=\"auto\" fill=\"#fff\" fill-rule=\"evenodd\" image-rendering=\"auto\" shape-rendering=\"auto\" solid-color=\"#000000\" style=\"font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal\"/></svg>",
            speed: "<svg width=\"16\" height=\"16\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path transform=\"scale(0.33)\" d=\"m25.172 5.2188c-10.697 0.011339-20.293 6.578-24.182 16.543 3.3251-7.1543 10.494-11.735 18.383-11.746 6.533 0.007559 12.661 3.1648 16.467 8.4746l8.9199-4.334c-4.9304-5.6708-12.073-8.9301-19.588-8.9375zm21.195 10.709l-23.268 11.244 0.019532 0.023437c-1.4749 0.76816-2.4941 2.2933-2.4941 4.0703 9e-6 2.5428 2.0627 4.6055 4.6055 4.6055 1.3981 0 2.6374-0.63675 3.4824-1.6211l0.013671 0.017578 17.641-18.34z\" color=\"#000000\" color-rendering=\"auto\" dominant-baseline=\"auto\" fill=\"#fff\" image-rendering=\"auto\" shape-rendering=\"auto\" solid-color=\"#000000\" style=\"font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;paint-order:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal\"/></svg>"
        }

        /**
         * Used to change options after initiation
         * @param  {Object} options object of options to change
         * @return {NONE}
         */
        this.config = (options) => {
            this.merge(this.options, options);
        };

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

        /**
     * Check to see if the object is a DOM element or not
     * @param  {Object} obj The object to test against
     * @return {Boolean}    true/false, the object is an options object
     */
        this.isDOM = (obj) => {
            try {
                return obj instanceof HTMLElement;
            } catch (e) {
                return false;
            }
        };

        if (!this.isDOM(args[args.length - 1])) {
            this.options = this.merge(this.options, args.pop());
        }

        for (var i of args) {
            this.galleries.push({gallery: i, sources: [], index: null});

        }

        console.log("Gallery Wall Fullscreen instantiated with gallery(s): " + this.galleries.map((i) => {
            return i.gallery.id + " ";
        }));

        /*
     *  moveMain()
     *    Used to manage mouse movement on mouse down
     *
     *    Input(s):  {Event} e (mouse event)
     *
     *    Output(s): {NONE}
     */
        this.moveMain = (e) => {
            this.center.style.left = (e.clientX - this.start) + "px";
            this.left.style.left = this.center.offsetWidth + (e.clientX - this.start) + "px";
            this.right.style.left = "auto";
            this.right.style.right = this.center.offsetWidth - (e.clientX - this.start) + "px";
            this.current = e.clientX;
        }

        /*
     *  indexManage()
     *    Used to prevent mouse click events on mouse drag event
     *
     *    Input(s):  {Event} e (mouse event)
     *
     *    Output(s): {NONE}
     */
        this.indexManage = (e) => {
            if (e.clientX != this.start)
                this.open = false;
            else
                this.open = true;

            }

        /*
     *  upMain()
     *    Used to manage mouse up event on dragging of the main image
     *
     *    Input(s):  {NONE}
     *
     *    Output(s): {NONE}
     */
        this.upMain = () => {
            window.removeEventListener("mousemove", this.moveMain, true);
            window.removeEventListener("mouseup", this.upMain, true);
            if (this.current - this.start > 300) {
                this.left.style.visibility = "hidden";
                Velocity(this.center, {
                    left: this.center.offsetWidth,
                    right: -this.center.offsetWidth
                }, {duration: this.duration});
                Velocity(this.right, {
                    right: 0
                }, {duration: this.duration});
                setTimeout(() => {
                    this.center.style.visibility = "hidden";

                }, this.duration - 100);
                setTimeout(() => {
                    this.closeFullscreen(false);
                    if (this.currentIndex == 0) {
                        this.openFullscreen(this.currentGal, this.galleries[this.currentGal].sources.length - 1);

                    } else {
                        this.openFullscreen(this.currentGal, this.currentIndex - 1);

                    }

                }, this.duration + 25);

            } else if (this.current - this.start < -300) {
                this.right.style.visibility = "hidden";
                Velocity(this.center, {
                    left: -this.center.offsetWidth,
                    right: this.center.offsetWidth
                }, {duration: this.duration});
                Velocity(this.left, {
                    left: 0
                }, {duration: this.duration});
                setTimeout(() => {
                    this.center.style.visibility = "hidden";

                }, this.duration - 100);
                setTimeout(() => {
                    this.closeFullscreen(false);
                    if (this.currentIndex == this.galleries[this.currentGal].sources.length - 1) {
                        this.openFullscreen(this.currentGal, 0);

                    } else {
                        this.openFullscreen(this.currentGal, this.currentIndex + 1);

                    }

                }, this.duration + 25);

            } else {
                this.center.style.left = "0px";
                this.left.style.left = -this.center.offsetWidth + "px";
                this.right.style.left = -this.center.offsetWidth + "px";

                var l = this.left.firstChild;
                var r = this.right.firstChild;

                this.left.removeChild(l);
                this.right.removeChild(r);

                this.left.appendChild(r);
                this.right.appendChild(l);

            }

        }

        /*
     *  init()
     *    Used to initiate the gallery system
     *
     *    Input(s):  {NONE}
     *
     *    Output(s): {NONE}
     */
        this.init = () => {
            this.buildFullscreen();
            this.attach();
            this.buildIndex();

        }

        /*
     *  buildFullscreen()
     *    used to build the fullscreen element
     *
     *    Input(s):  {NONE}
     *
     *    Output(s): {NONE}
     */
        this.buildFullscreen = () => {
            this.mainWrapper = document.createElement('div');
            this.left = document.createElement('div');
            this.center = document.createElement('div');
            this.right = document.createElement('div');

            this.left.id = "gallery-wall-fullscreen-left";
            this.center.id = "gallery-wall-fullscreen-center";
            this.right.id = "gallery-wall-fullscreen-right";

            this.mainWrapper.appendChild(this.left);
            this.mainWrapper.appendChild(this.center);
            this.mainWrapper.appendChild(this.right);

            this.btnLeft = document.createElement('div');
            this.btnRight = document.createElement('div');
            this.btnClose = document.createElement('div');

            this.btnLeft.id = "gallery-wall-fullscreen-button-left";
            this.btnRight.id = "gallery-wall-fullscreen-button-right";
            this.btnClose.id = "gallery-wall-fullscreen-button-close";

            this.btnClose.onclick = () => {
                this.closeFullscreen(true);

            }

            var imgl = document.createElement("img");
            var imgc = document.createElement("img");
            var imgr = document.createElement("img");

            imgl.src = this.options.img_path + "/left.svg";
            imgc.src = this.options.img_path + "/close.svg";
            imgr.src = this.options.img_path + "/right.svg";

            this.btnLeft.appendChild(imgl);
            this.btnRight.appendChild(imgr);
            this.btnClose.appendChild(imgc);

            this.indexWrapper = document.createElement('div');
            this.indexWrapper.id = "gallery-wall-fullscreen-index-wrapper";

            this.fullscreenImageDetails = document.createElement('div');
            this.fullscreenImageDetails.id = "gallery-wall-fullscreen-image-details";

            this.fullscreen.appendChild(this.mainWrapper);

            this.fullscreen.appendChild(this.btnLeft);
            this.fullscreen.appendChild(this.btnRight);
            this.fullscreen.appendChild(this.btnClose);

            this.fullscreen.appendChild(this.indexWrapper);
            this.fullscreen.appendChild(this.fullscreenImageDetails);

        };

        /*
     *  attach()
     *    used to attach mouse click events to images for fullscreen
     *
     *    Input(s):  {NONE}
     *
     *    Output(s): {NONE}
     */
        this.attach = () => {
            var gals = this.galleries;
            for (var g of gals) {
                for (var i of g.gallery.children) {
                    if ((i.tagName == "DIV" && i.firstChild.tagName == "IMG" || i.tagName == "IMG") && !this.hasClass(i, "gallery-wall-collection")) {
                        var name = "null",
                            fstop = "null",
                            speed = "null",
                            focal = "null",
                            make = "null",
                            model = "null",
                            iso = "null",
                            by = "null";
                        if (i.tagName == "DIV") {
                            var img = i.firstChild;
                            if(img.getAttribute('data-name')) name = img.getAttribute('data-name');
                            if(img.getAttribute('data-f')) fstop = img.getAttribute('data-f');
                            if(img.getAttribute('data-tv')) speed = img.getAttribute('data-tv');
                            if(img.getAttribute('data-focal')) focal = img.getAttribute('data-focal');
                            if(img.getAttribute('data-make')) make = img.getAttribute('data-make');
                            if(img.getAttribute('data-model')) model = img.getAttribute('data-model');
                            if(img.getAttribute('data-iso')) iso = img.getAttribute('data-iso');
                            if(img.getAttribute('data-by')) by = img.getAttribute('data-by');
                            // g.sources.push(i.firstChild.src);
                            g.sources.push({
                                src  : i.firstChild.src,
                                name : name,
                                fstop: fstop,
                                speed: speed,
                                focal: focal,
                                make : make,
                                model: model,
                                iso  : iso,
                                by   : by
                            });
                            var src = g.sources.length-1;

                        } else {
                            // g.sources.push(i.src);
                            if(i.getAttribute('data-name')) name = i.getAttribute('data-name');
                            if(i.getAttribute('data-f')) fstop = i.getAttribute('data-f');
                            if(i.getAttribute('data-tv')) speed = i.getAttribute('data-tv');
                            if(i.getAttribute('data-focal')) focal = i.getAttribute('data-focal');
                            if(i.getAttribute('data-make')) make = i.getAttribute('data-make');
                            if(i.getAttribute('data-model')) model = i.getAttribute('data-model');
                            if(i.getAttribute('data-iso')) iso = i.getAttribute('data-iso');
                            if(i.getAttribute('data-by')) by = i.getAttribute('data-by');
                            g.sources.push({
                                src  : i.src,
                                name : name,
                                fstop: fstop,
                                speed: speed,
                                focal: focal,
                                make : make,
                                model: model,
                                iso  : iso,
                                by   : by
                            });
                            var src = g.sources.length-1;

                        }

                        let srcc = src;

                        i.ondragstart = () => {
                            return false;
                        };

                        i.onclick = () => {
                            this.openFullscreen(gals.indexOf(g), srcc);

                        };

                    }

                }

            }

        };

        /*
     *  add()
     *    used to add a new gallery to manage
     *
     *    Input(s):  {DOM} elem (the element to add to galleries manager)
     *
     *    Output(s): {Int} (index of the added element)
     */
        this.add = (elem) => {
            var index = this.galleries.length;
            this.galleries.push({gallery: elem, sources: [], index: null});
            for (var i of this.galleries[index].gallery.children) {
                if ((i.tagName == "DIV" && i.firstChild.tagName == "IMG" || i.tagName == "IMG") && !this.hasClass(i, "gallery-wall-collection")) {
                    var name = "null",
                        fstop = "null",
                        speed = "null",
                        focal = "null",
                        make = "null",
                        model = "null",
                        iso = "null",
                        by = "null";
                    if (i.tagName == "DIV") {
                        var img = i.firstChild;
                        if(img.getAttribute('data-name')) name = img.getAttribute('data-name');
                        if(img.getAttribute('data-f')) fstop = img.getAttribute('data-f');
                        if(img.getAttribute('data-tv')) speed = img.getAttribute('data-tv');
                        if(img.getAttribute('data-focal')) focal = img.getAttribute('data-focal');
                        if(img.getAttribute('data-make')) make = img.getAttribute('data-make');
                        if(img.getAttribute('data-model')) model = img.getAttribute('data-model');
                        if(img.getAttribute('data-iso')) iso = img.getAttribute('data-iso');
                        if(img.getAttribute('data-by')) by = img.getAttribute('data-by');
                        this.galleries[index].sources.push({
                            src  : img.src,
                            name : name,
                            fstop: fstop,
                            speed: speed,
                            focal: focal,
                            make : make,
                            model: model,
                            iso  : iso,
                            by   : by
                        });
                        var src = this.galleries[index].sources.length-1;

                    } else {
                        if(i.getAttribute('data-name')) name = i.getAttribute('data-name');
                        if(i.getAttribute('data-f')) fstop = i.getAttribute('data-f');
                        if(i.getAttribute('data-tv')) speed = i.getAttribute('data-tv');
                        if(i.getAttribute('data-focal')) focal = i.getAttribute('data-focal');
                        if(i.getAttribute('data-make')) make = i.getAttribute('data-make');
                        if(i.getAttribute('data-model')) model = i.getAttribute('data-model');
                        if(i.getAttribute('data-iso')) iso = i.getAttribute('data-iso');
                        if(i.getAttribute('data-by')) by = i.getAttribute('data-by');
                        this.galleries[index].sources.push({
                            src  : i.src,
                            name : name,
                            fstop: fstop,
                            speed: speed,
                            focal: focal,
                            make : make,
                            model: model,
                            iso  : iso,
                            by   : by
                        });
                        var src = this.galleries[index].sources.indexOf(i.src);

                    }

                    let srcc = src;

                    i.ondragstart = () => {
                        return false;
                    };

                    i.onclick = () => {
                        this.openFullscreen(index, srcc);

                    };

                }

            }
            this.buildIndex();
            return index;

        };

        /*
     *  remove()
     *    used to remove a gallery from the system
     *
     *    Input(s):  {Int} index (the index of the element to remove)
     *
     *    Output(s): {NONE}
     */
        this.remove = (index) => {
            this.galleries.splice(index, 1);

        }

        /*
     *  openFullscreen()
     *    DESCRIPTION
     *
     *    Input(s):  {Int} gal   (the index of the gallery
     *               {Int} index (the index of the image)
     *
     *    Output(s): {NONE}
     */
        this.openFullscreen = (gal, index) => {
            var name = '',
                fstop = '',
                speed = '',
                focal = '',
                make = '',
                model = '',
                iso = '',
                by = '';

            var galy = this.galleries[gal];

            var full = this.fullscreen;
            full.style.visibility = "visible";

            this.left.style.visibility = "visible";
            this.right.style.visibility = "visible";
            this.center.style.visibility = "visible";

            var imgC = document.createElement("img");
            var imgData = galy.sources[index];

            if(imgData.name != "null") name = imgData.name;
            if(imgData.fstop != "null") fstop = this.svg.aperture+" "+imgData.fstop;
            if(imgData.speed != "null") speed = this.svg.speed+" "+imgData.speed;
            if(imgData.focal != "null") focal = this.svg.focal+" "+imgData.focal;
            if(imgData.make != "null") make = imgData.make;
            if(imgData.make != "null" && imgData.model != "null") make += " "+imgData.model;
            if(imgData.by != "null") by = imgData.by;
            if(imgData.iso != "null") iso = "<span style=\"font-family: sans; margin-right: 0px !important;\">ISO</span>"+imgData.iso;

            var stringTmp = "";

            if(this.options.title){
                stringTmp += "<div><div class=\"gallery-wall-fullscreen-image-details-centre\">"+name+"</div>";
            }
            if(this.options.exif){
                stringTmp += "<span class=\"gallery-wall-fullscreen-image-details-left\"><span>"
                    +fstop+"</span> <span>"+speed+"</span> <span>"+focal+
                    "</span></span>";
            }
            if(this.options.exif || this.options.author){
                stringTmp += "<span class=\"gallery-wall-fullscreen-image-details-right\">";
            }
            if(this.options.author){
                stringTmp += "<span>"+by+"</span>";
            }
            if(this.options.exif){
                stringTmp += "<span>"+iso+"</span><span>"+make+"</span>";
            }
            if(this.options.exif || this.options.author){
                stringTmp += "</span></div>";
            }

            this.fullscreenImageDetails.innerHTML = stringTmp;

            imgC.src = imgData.src;

            if (index == galy.sources.length - 1) {
                var imgR = document.createElement("img");
                imgR.src = galy.sources[0].src;

                var imgL = document.createElement("img");
                imgL.src = galy.sources[index - 1].src;

            } else if (index == 0) {
                var imgR = document.createElement("img");
                imgR.src = galy.sources[index + 1].src;

                var imgL = document.createElement("img");
                imgL.src = galy.sources[galy.sources.length - 1].src;

            } else {
                var imgR = document.createElement("img");
                imgR.src = galy.sources[index + 1].src;

                var imgL = document.createElement("img");
                imgL.src = galy.sources[index - 1].src;

            }

            var h = full.clientHeight;
            var w = full.clientWidth;

            this.center.appendChild(imgC);
            this.left.appendChild(imgL);
            this.right.appendChild(imgR);

            imgC.ondragstart = () => {
                return false;
            };

            imgC.onmousedown = (e) => {
                var l = this.left.firstChild;
                var r = this.right.firstChild;
                this.left.removeChild(l);
                this.right.removeChild(r);

                this.left.appendChild(r);
                this.right.appendChild(l);

                this.currentGal = gal;
                this.currentIndex = index;
                this.start = e.clientX;
                window.addEventListener("mousemove", this.moveMain, true);
                window.addEventListener("mouseup", this.upMain, true);

            };

            this.left.style.left = -this.center.offsetWidth + "px";
            this.right.style.right = -this.center.offsetWidth + "px";

            if (!this.indexWrapper.firstChild)
                this.indexWrapper.appendChild(galy.index);
            var wi = 0;
            var id = 0;
            for (var i of this.indexWrapper.firstChild.children) {
                wi += i.offsetWidth + 8;
                id++;

            }
            this.indexWrapper.firstChild.style.width = wi + "px";
            Dragscroll.reset();

            if (imgC.offsetHeight > h) {
                imgC.style.height = (h - 10) + "px";
                imgC.style.width = "auto";

            } else if (imgC.offsetWidth > w) {
                imgC.style.width = (w - 10) + "px";
                imgC.style.height = "auto";

            } else {
                imgC.style.width = "auto";
                imgC.style.height = "auto";

            }
            if (imgL.offsetHeight > h) {
                imgL.style.height = (h - 10) + "px";
                imgL.style.width = "auto";

            } else if (imgL.offsetWidth > w) {
                imgL.style.width = (w - 10) + "px";
                imgL.style.height = "auto";

            }
            if (imgR.offsetHeight > h) {
                imgR.style.height = (h - 10) + "px";
                imgR.style.width = "auto";

            } else if (imgR.offsetWidth > w) {
                imgR.style.width = (w - 10) + "px";
                imgR.style.height = "auto";

            }

            var left = this.btnLeft;
            var right = this.btnRight;

            left.onclick = () => {
                if (!this.animate) {
                    this.animate = true;
                    this.right.visibility = "hidden";
                    Velocity(this.left, {
                        left: 0
                    }, {duration: this.duration});
                    Velocity(this.center, {
                        right: -this.center.offsetWidth,
                        left: this.center.offsetWidth
                    }, {duration: this.duration});
                    setTimeout(() => {
                        this.closeFullscreen(false);
                        if (index == 0) {
                            this.openFullscreen(gal, galy.sources.length - 1);

                        } else {
                            this.openFullscreen(gal, index - 1);

                        }

                        this.animate = false;

                    }, this.duration + 25);

                }

            };
            right.onclick = () => {
                if (!this.animate) {
                    this.animate = true;
                    this.left.visibility = "hidden";
                    Velocity(this.right, {
                        right: 0
                    }, {duration: this.duration});
                    Velocity(this.center, {
                        left: -this.center.offsetWidth,
                        right: this.center.offsetWidth
                    }, {duration: this.duration});
                    setTimeout(() => {
                        this.closeFullscreen(false);
                        if (index == galy.sources.length - 1) {
                            this.openFullscreen(gal, 0);

                        } else {
                            this.openFullscreen(gal, index + 1);

                        }

                        this.animate = false;

                    }, this.duration + 25);

                }

            };
            var indexs = document.getElementById("gallery-wall-fullscreen-index");
            for (var i of indexs.children) {
                this.removeClass(i, 'gallery-wall-fullscreen-index-active');

            }

            this.addClass(indexs.children[index], 'gallery-wall-fullscreen-index-active');

        };

        /*
     *  closeFullscreen()
     *    used to close / refresh the fullscreen
     *
     *    Input(s):  {Bool} h (boolean, hide the fullscreen (complete close))
     *
     *    Output(s): {NONE}
     */
        this.closeFullscreen = (h = true) => {
            this.left.style.visibility = "hidden";
            this.right.style.visibility = "hidden";
            Velocity(this.left, {
                left: -this.center.offsetWidth
            }, {duration: 0});
            Velocity(this.right, {
                right: -this.center.offsetWidth
            }, {duration: 0});
            Velocity(this.center, {
                left: 0,
                right: 0
            }, {duration: 0});

            if (h) {
                this.fullscreen.style.visibility = "hidden";
                this.center.style.visibility = "hidden";

            }

            if (this.left.firstChild)
                this.left.removeChild(this.left.firstChild);
            if (this.right.firstChild)
                this.right.removeChild(this.right.firstChild);
            if (this.center.firstChild)
                this.center.removeChild(this.center.firstChild);

            if (this.indexWrapper.firstChild && h)
                this.indexWrapper.removeChild(this.indexWrapper.firstChild);

            };

        /*
     *  buildIndex()
     *    Used to build the index of the gallery fullscreen
     *
     *    Input(s):  {NONE}
     *
     *    Output(s): {NONE}
     */
        this.buildIndex = () => {

            var gals = this.galleries;
            for (var i of gals) {
                if (!i.index) {
                    var index = document.createElement('div');
                    index.id = "gallery-wall-fullscreen-index";
                    this.addClass(index, 'dragscroll');
                    for (var j of i.sources) {
                        var img = document.createElement("img");
                        img.src = j.src;

                        var src = i.sources.indexOf(j);
                        let srcc = src;
                        let g = i;

                        img.ondragstart = () => {
                            return false;
                        };

                        img.onmousedown = (e) => {
                            window.addEventListener("mouseup", this.indexManage, false);
                            this.start = e.clientX;

                        };

                        img.onclick = () => {
                            if (this.open) {
                                this.closeFullscreen(false);
                                this.openFullscreen(gals.indexOf(g), srcc);

                            }
                            this.open = true;

                        }

                        index.appendChild(img);

                    }
                    i.index = index;

                }

            }

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
     *  removeClass()
     *    Used to remove class name from element
     *
     *    Input(s):  {DOM}    elem      (the element to remove from)
     *               {String} className (the name to remove)
     *
     *    Output(s): {NONE}
     */
        this.removeClass = (elem, className) => {
            if (elem.classList) {
                elem.classList.remove(className);
            } else if (this.hasClass(elem, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                elem.className = elem.className.replace(reg, ' ');

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
