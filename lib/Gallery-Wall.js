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
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.GalleryWall = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.

    /*******************************************************************************
     *
     *  GalleryWall
     *    Gallery Wall is the primary module for the Gallery Wall system, It
     *    will align the images in a <div> perfectly.
     *
     *    Variables:  {DOM}     gallery    (the element to manage)
     *                {Bool}    initaited  (used to check if init is ran once)
     *                {Object}  options    (the options for the system)
     *
     *    Functions:  {NONE}    config()       (used to set options)
     *                {NONE}    init()         (used to setup the gallery)
     *                {NONE}    setWidth()     (sets the widths of images)
     *                {Bool}    mobileCheck()  (checks to see if on a mobile device)
     *                {Bool}    hasClass()     (checks element if has classname)
     *                {Object}  merge()        (merges two objects together)
     *
     ******************************************************************************/
    return function GalleryWall(elem, options) {
        this.gallery = elem;
        this.initiated = false;

        if (this.gallery.id) {
            console.log("Gallery Wall instantiated with element id: \"" + this.gallery.id + "\"");
        } else {
            console.log("Gallery Wall instantiated with element tag name: \"" + this.gallery.tagName + "\"");
        }

        this.options = {
            imageHeight: 300,
            margin: 8,
            minWidth: 200, //minWidth <= imageHeight (less than or equal to)
            // imageWidth: 350,
            exif: true,
            author: true,
            title: true
        };

        this.svg = {
            aperture: "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\"><path transform=\"scale(0.33)\" d=\"m23.99 1.5957a22.413 22.413 0 0 0 -13.459 4.5176l4.8535 15.053 12.75-19.17a22.413 22.413 0 0 0 -4.1445 -0.40039zm5.9375 0.82617l-8.5664 12.912 22.352-1.9336a22.413 22.413 0 0 0 -13.785 -10.979zm-20.832 4.877a22.413 22.413 0 0 0 -7.5137 16.646l14.635 5.5312-7.1211-22.178zm35.418 7.7676l-14.865 1.3027 15.141 15.945a22.413 22.413 0 0 0 1.6152 -8.3047 22.413 22.413 0 0 0 -1.8906 -8.9434zm-10.51 8.4297l-3.0273 21.781a22.413 22.413 0 0 0 13.039 -11.262l-10.012-10.52zm-32.342 2.3281a22.413 22.413 0 0 0 8.6191 15.881l12.953-7.6992-21.572-8.1816zm29.488 5.5195l-19.332 11.459a22.413 22.413 0 0 0 12.172 3.6191 22.413 22.413 0 0 0 5.1699 -0.63086l1.9902-14.447z\" fill=\"#ffffff\" style=\"paint-order:normal\"/></svg>",
            focal: "<svg width=\"16\" height=\"16\" xmlns=\"http://www.w3.org/2000/svg\"><path transform=\"scale(0.33)\" d=\"m42.168 1.0215c-0.41304 0-0.59233 0.11885-0.98047 0.27344-0.38815 0.15458-0.88147 0.37174-1.4727 0.64844-1.1824 0.5534-2.7552 1.3336-4.5898 2.2832-3.6693 1.8991-8.3819 4.4511-13.037 7.0703-4.6552 2.6192-9.2534 5.3076-12.699 7.4824-1.7229 1.0874-3.1533 2.0465-4.1758 2.8164-0.51124 0.38476-0.91483 0.72187-1.2188 1.0234-0.15196 0.1508-0.28237 0.28892-0.38867 0.44531-0.10631 0.1561-0.21289 0.32547-0.21289 0.625 0 0.3001 0.10659 0.46883 0.21289 0.625 0.1063 0.1561 0.23671 0.29627 0.38867 0.44727 0.30392 0.30161 0.70751 0.63658 1.2188 1.0215 1.0225 0.76985 2.4529 1.7309 4.1758 2.8184 3.4458 2.1749 8.044 4.8632 12.699 7.4824 4.6552 2.6192 9.3678 5.1693 13.037 7.0684 1.8346 0.94957 3.4075 1.7376 4.5898 2.291 0.59118 0.27666 1.0845 0.48834 1.4727 0.64258 0.38814 0.15458 0.56743 0.27344 0.98047 0.27344l-0.01172-3.5508c0.16785 0-2.1335-0.0389-2.4434-0.16211-0.30992-0.12321-0.73683-0.30498-1.2539-0.54688-1.0342-0.48401-2.4411-1.183-4.0762-2.0293-0.41088-0.21266-0.94027-0.50209-1.3789-0.73242 1.3899-1.1354 2.386-3.1156 3.1016-5.5117 0.91091-3.0503 1.3522-6.8148 1.3496-10.541-0.00263-3.7262-0.44355-7.4053-1.3496-10.291-0.45303-1.4428-1.0202-2.6875-1.7285-3.6465-0.39771-0.53842-0.85298-0.97715-1.3535-1.3086 0.43222-0.22676 0.95418-0.51294 1.3594-0.72266 1.635-0.84627 3.042-1.5453 4.0762-2.0293 0.51708-0.24189 0.94399-0.43151 1.2539-0.55469 0.30992-0.12321 2.6112-1.2246 2.4434-1.2246zm-11.256 8.1387 0.45312 0.10742c0.53242 0.1217 1.0767 0.55036 1.5879 1.3125 0.51118 0.7621 0.97131 1.8336 1.3496 3.1094 0.75659 2.5515 1.1881 5.9167 1.2266 9.3301 0.03846 3.4134-0.31824 6.8816-1.0938 9.6406-0.77551 2.759-1.9848 4.7533-3.4609 5.3887l-0.2207 0.09375c-1.9261-1.0312-3.9265-2.1236-6.0391-3.2988 1.6541-1.3762 2.799-5.8935 2.7988-11.043-0.0017-5.3478-1.2362-9.981-2.9746-11.164 2.2332-1.2428 4.348-2.395 6.373-3.4766zm-9.3496 5.1465c-1.0536 2.1265-1.686 5.6847-1.6875 9.4941 0.0017 3.6261 0.57543 7.0358 1.5469 9.1934-3.6867-2.0912-7.2793-4.1886-10.004-5.9082-1.5284-0.96469-2.7928-1.8138-3.6602-2.4668-0.43366-0.32655-0.77013-0.60766-0.97461-0.81055-0.052732-0.05216-0.069492-0.07712-0.10352-0.11719 0.034167-0.04044 0.050288-0.06623 0.10352-0.11914 0.20448-0.20296 0.54095-0.48602 0.97461-0.8125 0.86731-0.65303 2.1317-1.5002 3.6602-2.4648 2.7599-1.742 6.4069-3.8701 10.145-5.9883z\" color=\"#000000\" color-rendering=\"auto\" dominant-baseline=\"auto\" fill=\"#fff\" fill-rule=\"evenodd\" image-rendering=\"auto\" shape-rendering=\"auto\" solid-color=\"#000000\" style=\"font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal\"/></svg>",
            speed: "<svg width=\"16\" height=\"16\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path transform=\"scale(0.33)\" d=\"m25.172 5.2188c-10.697 0.011339-20.293 6.578-24.182 16.543 3.3251-7.1543 10.494-11.735 18.383-11.746 6.533 0.007559 12.661 3.1648 16.467 8.4746l8.9199-4.334c-4.9304-5.6708-12.073-8.9301-19.588-8.9375zm21.195 10.709l-23.268 11.244 0.019532 0.023437c-1.4749 0.76816-2.4941 2.2933-2.4941 4.0703 9e-6 2.5428 2.0627 4.6055 4.6055 4.6055 1.3981 0 2.6374-0.63675 3.4824-1.6211l0.013671 0.017578 17.641-18.34z\" color=\"#000000\" color-rendering=\"auto\" dominant-baseline=\"auto\" fill=\"#fff\" image-rendering=\"auto\" shape-rendering=\"auto\" solid-color=\"#000000\" style=\"font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;paint-order:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal\"/></svg>"
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

        if (options) {
            this.options = this.merge(this.options, options);
        }

        /**
         * Used to modify the options after instantiation
         * @param  {Object} options The new options to merge with the old once
         * @return {NONE}
         */
        this.config = (options) => {
            this.options = this.merge(options, this.options);
        }

        /**
         * Used to initiate the the gallery system, and align the images
         * @return {NONE}
         */
        this.init = () => {

            var children = this.gallery.children;
            var childNodes = this.gallery.childNodes;
            var ops = this.options;

            if (!this.initiated) { // init already ran?
                this.initiated = true;
                var self = this;
                window.addEventListener("resize", () => {
                    self.init();
                }, false);

                if (this.mobileCheck()) {
                    ops.imageHeight += 200;

                }

                // convert img elements into gallery system
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].tagName == "IMG") {
                        var div = document.createElement("div");
                        var div2 = document.createElement("div");

                        var divInfo = document.createElement("div");
                        divInfo.appendChild(this.createInfo(childNodes[i]));
                        divInfo.className = "gallery-wall-info";
                        div2.appendChild(divInfo);

                        div.appendChild(childNodes[i]);
                        div.appendChild(div2);
                        div.style.height = this.options.imageHeight + "px";
                        div.style.margin = this.options.margin + "px";
                        div.style.width = "auto";

                        this.gallery.appendChild(div);
                        i--;

                    } else if (childNodes[i].tagName == "DIV" && this.hasClass(childNodes[i], "gallery-wall-collection")) {

                        var div = childNodes[i];
                        div.style.height = this.options.imageHeight + "px";
                        div.style.margin = this.options.margin + "px";
                        if (div.galleryWallMoved != "true") {
                            div.galleryWallMoved = "true"
                            this.gallery.removeChild(div);
                            this.gallery.appendChild(div);

                        }

                    }

                }

                // remove old img elements from gallery
                for (var i = 0; i < this.gallery.childNodes.length; i++) {
                    if (this.gallery.childNodes[i].tagName == "IMG") {
                        this.gallery.removeChild(this.gallery.childNodes[i]);
                        i--;

                    }

                }

            } // end initation check

            for (var i = 0; i < children.length; i++) {
                if (children[i].tagName == "DIV" || children[i].tagName == "IMG") {
                    if (!this.hasClass(children[i], "gallery-wall-collection")) {
                        children[i].style.width = "auto";

                    }

                }

            }

            var widthTotal = Math.floor(this.gallery.offsetWidth);
            var widthCur = 0;

            // align elements
            var start = 0;
            for (var i = 0; i < children.length; i++) {
                if (children[i].tagName == "DIV") {
                    if (!this.hasClass(children[i], "gallery-wall-collection")) {
                        children[i].firstChild.style.visibility = "visible";

                    }
                    widthCur += children[i].offsetWidth + (ops.margin * 2);
                    if (widthCur >= widthTotal) {
                        this.setWidth(children, start, i, widthCur, widthTotal, ops.minWidth);
                        // if(this.mobileCheck()){ // not sure why, but needed to run twice when on mobile
                        //   var widthCur2 = 0;
                        //   for(var j=start; j<i; j++){
                        //     widthCur2 += children[i].offsetWidth + (ops.margin * 2);
                        //     if(widthCur2 >= widthTotal){
                        //       this.setWidth(children, start, i, widthCur, widthTotal, ops.minWidth);
                        //
                        //     }
                        //
                        //   }
                        //
                        // }

                        widthCur = 0;
                        start = i + 1;

                    }

                }

            }

        };

        /**
         * Create DOM layout for EXIF info
         * @param  {DOM} elem the dom to get info from
         * @return {DOM}      the created info dom
         */

        // data-name="TESTNAME" data-f="4.0" data-tv="1/100 s" data-focal="20.1 mm" data-maker="Canon" data-model="T3i"
        this.createInfo = (elem) => {
            var name = "null",
                fstop = "null",
                speed = "null",
                focal = "null",
                make = "null",
                model = "null",
                iso = "null",
                by = "null";
            var arrayBuild = [];

            if(elem.getAttribute('data-name') && elem.getAttribute('data-name') != "null") name = elem.getAttribute('data-name');
            if(elem.getAttribute('data-f') && elem.getAttribute('data-f') != "null") fstop = elem.getAttribute('data-f');
            if(elem.getAttribute('data-tv') && elem.getAttribute('data-tv') != "null") speed = elem.getAttribute('data-tv');
            if(elem.getAttribute('data-focal') && elem.getAttribute('data-focal') != "null") focal = elem.getAttribute('data-focal');
            if(elem.getAttribute('data-make') && elem.getAttribute('data-make') != "null") make = elem.getAttribute('data-make');
            if(elem.getAttribute('data-model') && elem.getAttribute('data-model') != "null") model = elem.getAttribute('data-model');
            if(elem.getAttribute('data-iso') && elem.getAttribute('data-iso') != "null") iso = elem.getAttribute('data-iso');
            if(elem.getAttribute('data-by') && elem.getAttribute('data-by') != "null") by = elem.getAttribute('data-by');

            var span1 = document.createElement('span');
            span1.className = "gallery-wall-info-span";
            var span2 = document.createElement('span');
            span2.className = "gallery-wall-info-span";
            var span3 = document.createElement('span');
            span3.className = "gallery-wall-info-span";
            var stringTmp = "";

            if(this.options.exif){
                if(focal != "null") stringTmp +=  "<span class=\"gallery-wall-info-left\">"+this.svg.focal+" "+focal;
                if(make != "null") stringTmp += "<span class=\"gallery-wall-info-right\">"+make;
                if(make != "null" && model != "null") stringTmp += " " + model;
                if(make != "null") stringTmp += "</span>";
                span1.innerHTML = stringTmp+"<br />";
            }

            stringTmp = "";

            if(this.options.exif){
                if(fstop != "null") stringTmp += "<span class=\"gallery-wall-info-left\">"+this.svg.aperture+" "+fstop+"</span>";
                if(speed != "null") stringTmp += "<span class=\"gallery-wall-info-right\">"+speed+" "+this.svg.speed+"</span>";
                span2.innerHTML = stringTmp+"<br />";
            }

            stringTmp = "";

            if(this.options.exif){
                if(iso != "null") stringTmp += "<span class=\"gallery-wall-info-left\"><span style=\"font-family: sans;\">ISO</span> "+iso+"</span>";
            }
            if(this.options.author){
                if(by != "null") stringTmp += "<span class=\"gallery-wall-info-right\">"+by+"</span>";
            }
            span3.innerHTML = stringTmp;

            var h4 = document.createElement("h4");
            if(this.options.title){
                if(name != "null") h4.innerHTML = name;
            }
            h4.className = "gallery-wall-info-name";

            var div = document.createElement("div");
            div.appendChild(h4);

            var div2 = document.createElement("div");
            div2.className = "gallery-wall-info-detail";
            if((focal == "null"
               && make == "null"
               && model == "null"
               && fstop == "null"
               && speed == "null")
               || (!this.options.exif && !this.options.author)) {
               div2.className += " gallery-wall-info-detail-hidden";
            }

            div2.appendChild(span1);
            div2.appendChild(span2);
            div2.appendChild(span3);

            div.appendChild(div2);

            return div;
        }

        /**
         * Used to set a row of image widths for perfect alignment
         * @param {Array}   children   The DOM children to loop through
         * @param {Integer} start      The start index
         * @param {Integer} end        The ending index
         * @param {Integer} widthCur   The current width of the elements in a row
         * @param {Integer} widthTotal The maximum width of the containter
         * @param {Integer} minWidth   The minumum width of an image
         */
        this.setWidth = (children, start, end, widthCur, widthTotal, minWidth) => {
            var sacrifice = [];
            var difference = widthCur - widthTotal;
            for (var i = start; i <= end; i++) {
                if (children[i].clientWidth - minWidth < 0 || this.hasClass(children[i], "gallery-wall-collection")) {
                    sacrifice.push(0);

                } else {
                    sacrifice.push(children[i].clientWidth - minWidth);

                }

            }

            var tot = 0;
            for (var i = 0; i < sacrifice.length; i++) {
                tot += sacrifice[i];

            }

            for (var i = start, j = 0; i <= end; i++, j++) {
                if (sacrifice[i] == 0) {} else {
                    children[i].style.width = Math.floor(children[i].offsetWidth - ((sacrifice[j] / tot) * difference)) + "px";

                }

            }

        };

        /**
         * Used to check the browser to see if the user is on a mobile device
         * @return {boolean} true/false, whether or not they are on mobile
         */
        this.mobileCheck = () => {
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    check = true
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        /**
         * Checks a given element to see if the given class is in the element
         * @param  {DOM}  elem      The element to check
         * @param  {String}  className The class name to check
         * @return {Boolean}           true/false, the class name exists
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

        this.init();

    };

}));
