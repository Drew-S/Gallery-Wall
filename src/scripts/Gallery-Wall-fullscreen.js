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
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['velocity', 'dragscroll'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./velocity'), require('./dragscroll'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.velocity, root.dragscroll);
  }
}(this, function (Velocity, Dragscroll) {


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

    for(var i of args){
      this.galleries.push({ gallery: i, sources: [], index: null });

    }

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
      if(e.clientX != this.start) this.open = false;
      else this.open = true;

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
      if(this.current - this.start > 300) {
        this.left.style.visibility = "hidden";
        Velocity(this.center, { left: this.center.offsetWidth, right: -this.center.offsetWidth }, { duration: this.duration });
        Velocity(this.right, { right: 0 }, { duration: this.duration });
        setTimeout(() => {
          this.center.style.visibility = "hidden";

        }, this.duration-100);
        setTimeout(() => {
          this.closeFullscreen(false);
          if(this.currentIndex == 0) {
            this.openFullscreen(this.currentGal, this.galleries[this.currentGal].sources.length-1);

          } else {
            this.openFullscreen(this.currentGal, this.currentIndex-1);

          }


        }, this.duration+25);

      } else if(this.current - this.start < -300){
        this.right.style.visibility = "hidden";
        Velocity(this.center, { left: -this.center.offsetWidth, right: this.center.offsetWidth }, { duration: this.duration });
        Velocity(this.left, { left: 0 }, { duration: this.duration });
        setTimeout(() => {
          this.center.style.visibility = "hidden";

        }, this.duration-100);
        setTimeout(() => {
          this.closeFullscreen(false);
          if(this.currentIndex == this.galleries[this.currentGal].sources.length-1) {
            this.openFullscreen(this.currentGal, 0);

          } else {
            this.openFullscreen(this.currentGal, this.currentIndex+1);

          }

        }, this.duration+25);

      } else {
        this.center.style.left = "0px";
        this.left.style.left = -this.center.offsetWidth+"px";
        this.right.style.left = -this.center.offsetWidth+"px";

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

      imgl.src = "imgs/left.svg";
      imgc.src = "imgs/close.svg";
      imgr.src = "imgs/right.svg";

      this.btnLeft.appendChild(imgl);
      this.btnRight.appendChild(imgr);
      this.btnClose.appendChild(imgc);

      this.indexWrapper = document.createElement('div');

      this.indexWrapper.id = "gallery-wall-fullscreen-index-wrapper";

      this.fullscreen.appendChild(this.mainWrapper);

      this.fullscreen.appendChild(this.btnLeft);
      this.fullscreen.appendChild(this.btnRight);
      this.fullscreen.appendChild(this.btnClose);

      this.fullscreen.appendChild(this.indexWrapper);

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
      for(var g of gals){
        for(var i of g.gallery.children){
          if((i.tagName == "DIV" && i.firstChild.tagName == "IMG"
              || i.tagName == "IMG") && !this.hasClass(i, "gallery-wall-collection")){
            if(i.tagName == "DIV"){
              g.sources.push(i.firstChild.src);
              var src = g.sources.indexOf(i.firstChild.src);

            } else {
              g.sources.push(i.src);
              var src = g.sources.indexOf(i.src);

            }

            let srcc = src;

            i.ondragstart = () => { return false; };

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
      this.galleries.push({ gallery: elem, sources: [], index: null });
      for(var i of this.galleries[index].gallery.children){
        if((i.tagName == "DIV" && i.firstChild.tagName == "IMG"
            || i.tagName == "IMG") && !this.hasClass(i, "gallery-wall-collection")){
          if(i.tagName == "DIV"){
            this.galleries[index].sources.push(i.firstChild.src);
            var src = this.galleries[index].sources.indexOf(i.firstChild.src);

          } else {
            this.galleries[index].sources.push(i.src);
            var src = this.galleries[index].sources.indexOf(i.src);

          }

          let srcc = src;

          i.ondragstart = () => { return false; };

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

      var galy = this.galleries[gal];

      var full = this.fullscreen;
      full.style.visibility = "visible";

      this.left.style.visibility = "visible";
      this.right.style.visibility = "visible";
      this.center.style.visibility = "visible";

      var imgC = document.createElement("img");
      imgC.src = galy.sources[index];

      if(index == galy.sources.length-1){
        var imgR = document.createElement("img");
        imgR.src = galy.sources[0];

        var imgL = document.createElement("img");
        imgL.src = galy.sources[index-1];

      } else if(index == 0){
        var imgR = document.createElement("img");
        imgR.src = galy.sources[index+1];

        var imgL = document.createElement("img");
        imgL.src = galy.sources[galy.sources.length-1];

      } else {
        var imgR = document.createElement("img");
        imgR.src = galy.sources[index+1];

        var imgL = document.createElement("img");
        imgL.src = galy.sources[index-1];

      }

      var h = this.fullscreen.offsetHeight;
      var w = this.fullscreen.offsetWidth;

      this.center.appendChild(imgC);
      this.left.appendChild(imgL);
      this.right.appendChild(imgR);

      imgC.ondragstart = () => { return false; };

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

      this.left.style.left = - this.center.offsetWidth + "px";
      this.right.style.right = - this.center.offsetWidth + "px";

      if(!this.indexWrapper.firstChild) this.indexWrapper.appendChild(galy.index);
      var w = 0;
      var id = 0;
      for(var i of this.indexWrapper.firstChild.children){
        w += i.offsetWidth + 8;
        id++;

      }
      this.indexWrapper.firstChild.style.width = w + "px";
      Dragscroll.reset();

      if(imgC.offsetHeight > h){
        imgC.style.height = (h-10) + "px";
        imgC.style.width = "auto";

      } else if(imgC.offsetWidth > w) {
        imgC.style.width = (w-10) + "px";
        imgC.style.height = "auto";

      }
      if(imgL.offsetHeight > h){
        imgL.style.height = (h-10) + "px";
        imgL.style.width = "auto";

      } else if(imgL.offsetWidth > w) {
        imgL.style.width = (w-10) + "px";
        imgL.style.height = "auto";

      }
      if(imgR.offsetHeight > h){
        imgR.style.height = (h-10) + "px";
        imgR.style.width = "auto";

      } else if(imgR.offsetWidth > w) {
        imgR.style.width = (w-10) + "px";
        imgR.style.height = "auto";

      }

      var left = this.btnLeft;
      var right = this.btnRight;

      left.onclick = () => {
        if(!this.animate){
          this.animate = true;
          this.right.visibility = "hidden";
          Velocity(this.left, { left: 0 }, { duration: this.duration });
          Velocity(this.center, { right: -this.center.offsetWidth, left: this.center.offsetWidth }, { duration: this.duration });
          setTimeout(() => {
            this.closeFullscreen(false);
            if(index == 0) {
              this.openFullscreen(gal, galy.sources.length-1);

            } else {
              this.openFullscreen(gal, index-1);

            }

            this.animate = false;

          }, this.duration+25);

        }

      };
      right.onclick = () => {
        if(!this.animate){
          this.animate = true;
          this.left.visibility = "hidden";
          Velocity(this.right, { right: 0}, { duration: this.duration });
          Velocity(this.center, { left: -this.center.offsetWidth, right: this.center.offsetWidth }, { duration: this.duration });
          setTimeout(() => {
            this.closeFullscreen(false);
            if(index == galy.sources.length-1) {
              this.openFullscreen(gal, 0);

            } else {
              this.openFullscreen(gal, index+1);

            }

            this.animate = false;

          }, this.duration+25);

        }

      };
      var indexs = document.getElementById("gallery-wall-fullscreen-index");
      for(var i of indexs.children){
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
    this.closeFullscreen = (h=true) => {
      this.left.style.visibility = "hidden";
      this.right.style.visibility = "hidden";
      Velocity(this.left, { left: -this.center.offsetWidth}, { duration: 0 });
      Velocity(this.right, { right: -this.center.offsetWidth}, { duration: 0 });
      Velocity(this.center, { left: 0, right: 0}, { duration: 0 });

      if(h) {
        this.fullscreen.style.visibility = "hidden";
        this.center.style.visibility = "hidden";

      }

      if(this.left.firstChild) this.left.removeChild(this.left.firstChild);
      if(this.right.firstChild) this.right.removeChild(this.right.firstChild);
      if(this.center.firstChild) this.center.removeChild(this.center.firstChild);

      if(this.indexWrapper.firstChild && h) this.indexWrapper.removeChild(this.indexWrapper.firstChild);

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
      for(var i of gals){
        if(!i.index){
          var index = document.createElement('div');
          index.id = "gallery-wall-fullscreen-index";
          this.addClass(index, 'dragscroll');
          for(var j of i.sources){
            var img = document.createElement("img");
            img.src = j;

            var src = i.sources.indexOf(j);
            let srcc = src;
            let g = i;

            img.ondragstart = () => { return false; };

            img.onmousedown = (e) => {
              window.addEventListener("mouseup", this.indexManage, false);
              this.start = e.clientX;

            };

            img.onclick = () => {
              if(this.open){
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
      if(elem.classList){return elem.classList.contains(className);}
      else if(elem.className) {return !!elem.className.match(new RegExp('(\\s|^)'
              + className + '(\\s|$)'));}
      else {return false;}

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
      if (elem.classList){elem.classList.remove(className);}
      else if (this.hasClass(elem, className)) {
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
      if (elem.classList){elem.classList.add(className);}
      else if (!this.hasClass(elem, className)) elem.className += " " + className;

    };

    this.init();

  };

}));
