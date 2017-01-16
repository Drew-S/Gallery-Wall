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
        define(['dragscroll'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./dragscroll'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.dragscroll);
  }
}(this, function (Dragscroll) {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.

    /*******************************************************************************
     *
     *  CLASS
     *    CLASS_INFO
     *
     *    Variables:  {Array}  collections  (the collection elements to manage)
     *
     *    Functions:  {NONE}  init()             (initiate the class)
     *                {NONE}  openCollection()   (open the collection)
     *                {NONE}  closeCollection()  (close the collection)
     *                {NONE}  buildCollection()  (build the collection)
     *                {Bool}  hasClass()         (checks for class name)
     *                {NONE}  addClass()         (add class to element)
     *
     ******************************************************************************/
    return function GalleryWallCollection(fullscreen){

      this.collections = [];

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
        for(var i of collectionsTMP){
          this.collections.push({ collection: [] });

          for(var j of i.children){
            this.collections[n].collection.push(j.src);

          }

          let e = n;
          i.onclick = () => {
            this.openCollection(e);

          }
          n++;

        }
        for(var i of document.getElementsByClassName('gallery-wall-collection')){
          var division = i.children.length;
          if(division > 4) division = 4;
          var width = i.offsetWidth;
          for(var j=0; j<i.children.length; j++){
            if(i.children[j].tagName == "IMG"){
              var div = document.createElement("div");

              div.appendChild(i.children[j]);
              div.appendChild(document.createElement("div"));
              i.appendChild(div);
              j--;

            }

          }
          for(var j=0; j<i.children.length; j++){
            if(i.children[j].tagName == "IMG"){
              i.removeChild(i.children[j]);
              j--;

            } else if(i.children[j].tagName == "DIV"){
              if(j > 4) i.children[j].style.width = "0px";
              else i.children[j].style.width = width/division + "px";

            }

          }

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
        for(var i of this.collections[index].collection){
          var div = document.createElement("div");
          var img = document.createElement("img");
          img.src = i;
          div.appendChild(img);
          div.appendChild(document.createElement("div"));
          this.collection.appendChild(div);

        }
        var width = (this.collection.offsetWidth / 4) - 32;

        for(var i of this.collection.children){
          i.style.width = width + "px";
          i.style.height = width - 20 + "px";
          if(i.firstChild.offsetWidth < i.firstChild.offsetHeight){
            i.firstChild.style.width = "100%";
            i.firstChild.style.height = "auto";

          }

        }
        if(fullscreen){
          this.index = fullscreen.add(this.collection);

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
        while(this.collection.firstChild){
          this.collection.removeChild(this.collection.firstChild);

        }
        if(fullscreen && this.index){
          fullscreen.remove(this.index);
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

        var div2 = document.createElement("div");
        div2.id = "gallery-wall-collection-close";

        var img = document.createElement("img");
        img.src = "imgs/close.svg";
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
        if(elem.classList){return elem.classList.contains(className);}
        else if(elem.className) {return !!elem.className.match(new RegExp('(\\s|^)'
                + className + '(\\s|$)'));}
        else {return false;}

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
