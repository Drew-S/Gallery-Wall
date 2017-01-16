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
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

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
     *    Functions:  {NONE}  config()       (used to set options)
     *                {NONE}  init()         (used to setup the gallery)
     *                {NONE}  setWidth()     (sets the widths of images)
     *                {Bool}  mobileCheck()  (checks to see if on a mobile device)
     *                {Bool}  hasClass()     (checks element if has classname)
     *
     ******************************************************************************/
    return function GalleryWall(elem){
      this.gallery = elem;
      this.initiated = false;

      this.options = {
        imageHeight: 300,
        margin: 8,
        minWidth: 200, //minWidth <= imageHeight (less than or equal to)
        imageWidth: 350

      };

      /*
       *  config()
       *    Used to set options values
       *
       *    Input(s): {Object} ops (the object of options to change)
       *
       *    Output(s): {NONE}
       */
      this.config = (ops) => {
        if(ops){
          if(ops.imageHeight) this.options.imageHeight = ops.imageHeight;
          if(ops.margin) this.options.margin = ops.margin;
          if(ops.minWidth) this.options.minWidth = ops.minWidth;

        }

      }

      /*
       *  init()
       *    Used to initiate the the gallery system, and align the images
       *
       *    Input(s):  {NONE}
       *
       *    Output(s): {NONE}
       */
      this.init = () => {

        var children = this.gallery.children;
        var childNodes = this.gallery.childNodes;
        var ops = this.options;

        if(!this.initiated){ // init already ran?
          this.initiated = true;
          var self = this;
          window.addEventListener("resize", () => { self.init(); }, false);

          if(this.mobileCheck()){
            ops.imageHeight += 200;

          }

          // convert img elements into gallery system
          for(var i=0; i<childNodes.length; i++){
            if(childNodes[i].tagName == "IMG"){
              var div = document.createElement("div");
              var div2 = document.createElement("div");
              div.appendChild(childNodes[i]);
              div.appendChild(div2);
              div.style.width = "auto";
              this.gallery.appendChild(div);
              i--;

            } else if(childNodes[i].tagName == "DIV"
              && this.hasClass(childNodes[i], "gallery-wall-collection")){

              var div = childNodes[i];
              if(div.galleryWallMoved != "true"){
                div.galleryWallMoved = "true"
                this.gallery.removeChild(div);
                this.gallery.appendChild(div);

              }

            }

          }

          // remove old img elements from gallery
          for(var i=0; i<this.gallery.childNodes.length; i++){
            if(this.gallery.childNodes[i].tagName == "IMG"){
              this.gallery.removeChild(this.gallery.childNodes[i]);
              i--;

            }

          }

        } // end initation check

        for(var i=0; i<children.length; i++){
          if(children[i].tagName == "DIV" || children[i].tagName == "IMG"){
            if(!this.hasClass(children[i], "gallery-wall-collection")){
              children[i].style.width = "auto";

            }

          }

        }

        var widthTotal = this.gallery.offsetWidth;
        var widthCur = 0;

        // align elements
        var start = 0;
        for(var i=0; i<children.length; i++){
          if(children[i].tagName == "DIV"){
            if(!this.hasClass(children[i], "gallery-wall-collection")){
              children[i].firstChild.style.visibility = "visible";

            }
            widthCur += children[i].offsetWidth + (ops.margin * 2);
            if(widthCur >= widthTotal){
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
              start = i+1;

            }

          }

        }

      };

      /*
       *  setWidth()
       *    Used to set a row of images widths for perfect alignment
       *
       *    Input(s):  {Array} children   (the array of elements to align)
       *               {Int}   start      (the starting point to align in array)
       *               {Int}   end        (the ending point to align in array)
       *               {Int}   widthCur   (the current width of the elements)
       *               {Int}   widthTotal (the total width)
       *               {Int}   minWidth   (the minumum width of the element)
       *
       *    Output(s): {NONE}
       */
      this.setWidth = (children, start, end, widthCur, widthTotal, minWidth) => {
        var sacrifice = [];
        var difference = widthCur - widthTotal;
        for(var i=start; i<=end; i++){
          if(children[i].clientWidth - minWidth < 0 || this.hasClass(children[i], "gallery-wall-collection")){
            sacrifice.push(0);

          } else {
            sacrifice.push(children[i].clientWidth - minWidth);

          }

        }

        var tot = 0;
        for(var i=0; i<sacrifice.length; i++){
          tot += sacrifice[i];

        }

        for(var i=start, j=0; i<=end; i++, j++){
          if(sacrifice[i] == 0){

          } else {
            children[i].style.width = children[i].offsetWidth
              - ((sacrifice[j] / tot) * difference) + "px";

          }

        }

      };

      /*
       *  mobileCheck()
       *    Used to check the browser to see if user is on mobile
       *
       *    Input(s):  {NONE}
       *
       *    Output(s): {Bool} (true/false if they are on mobile)
       */
      this.mobileCheck = () => {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };

      /*
      *  hasClass()
      *    Checks a given element to see if the given class is in the element
      *
      *    Input(s):  {DOM}    elem      (the element to check)
      *               {String} className (the name to check for)
      *
      *    Output(s): {Bool} (true/false, has the class name or not)
      */
      this.hasClass = (elem, className) => {
        if(elem.classList){return elem.classList.contains(className);}
        else if(elem.className) {return !!elem.className.match(new RegExp('(\\s|^)'
        + className + '(\\s|$)'));}
        else {return false;}

      };

      this.init();

    };

}));
