/*
  Gallery script reads a class and sizes the witdths of its children so the images
  all align perfectly

  It also holds methods so you can enter a fullscreen mode

  usage, add this script to your page eg:
  <script type="text/javascript" src="http://yoursite.com/scripts/gallery.js"></script>

  and in a window.onload, and window.onresize call Gallery.setup();

  Some css stylings are required to work, see provided css file
*/

var Gallery = new function(){

  this._class_name = "Gallery"; // same as var Gallery = new function(){...}
                                // if you cange Gallery to something else be sure to change
                                // the name of this class to match, and the event listeners
                                // at bottom of script

  this._img_right = "imgs/right.svg";
  this._img_left = "imgs/left.svg";
  this._img_close = "imgs/close.svg";

  //set minimum width for images, and the margins, img heights, index thumbnail height
  this._min_width = 350;
  this._margin = 8; //margins are left right top and bottom same as style{margin: Xpx;}, no 'px'
  this._img_height = 300;
  this._gallery_index_height = 120;

  //class of the container the images are held in
  this._gallery = "gallery";
  this._index_icon = "gal_inner_index_icon";
  this._art_img_div = "art_img_div"

  //names of the classes and ids used by the script
  this._gallery_full = "gallery_full";
  this._main = "gal_inner_main";
  this._close = "gal_inner_close";
  this._right = "gal_inner_right";
  this._left = "gal_inner_left";
  this._index = "gal_inner_index";
  this._index_current = "gal_inner_index_imgs_current";
  this._img = "gal_inner_img";
  this._img_gal_left = "gal_inner_img_left";
  this._img_gal_right = "gal_inner_img_right";
  this._disable_scroll = "disable_scroll";

  //handles touch events variables beyond here should not be touched
  this._xDown = null;
  this._yDown = null;
  this._xUp = null;
  this._yUp = null;
  this._xDif = null;
  this._yDif = null;

  //information about the fullscreen mode used by touch events
  this._gallery_open = false;
  this._parent_id = null;
  this._left_index = null;
  this._right_index = null;
  this._index_max = null;
  this._lr = false;
  this._st = false;
  this._t = false;
  this._l = false;
  this._r = false;

  this._window_w = window.innerWidth;
  this._window_h = window.innerHeight;

  this._initial = false;

  //hanldes touch down event
  this.handleTouchStart = (e) => {
    this._xDown = e.touches[0].screenX;
    this._yDown = e.touches[0].screenY;
    this._st = true;
  };

  //handles touch end
  this.handleTouchEnd = (e) => {
    this._xDown = null;
    this._yDown = null;
    this._xUp = null;
    this._yUp = null;
    this._xDif = null;
    this._yDif = null;
    try{
      var img = document.getElementById(this._img);
      var left = document.getElementById(this._img_gal_left);
      var right = document.getElementById(this._img_gal_right);
      var gallery = document.getElementById(this._gallery_full);
      gallery.style.opacity = 1;
      img.style.margin = "auto";
      img.style.top = "0px";
      img.style.left = "0px";
      img.style.bottom = "0px";
      img.style.right = "0px";
      left.style.right = this._window_w + "px";
      right.style.left = this._window_w + "px";
    } catch (err){}
    if(this._t){
      this.close_full();
    } else if(this._l){
      this.set_index_full(this._right_index, this._parent_id);
    } else if(this._r){
      this.set_index_full(this._left_index, this._parent_id);
    }
    this._t = false;
    this._l = false;
    this._r = false;
  };

  //hanldes touch movement events
  this.handleTouchMove = (e, passive=true) => {
    var threshhold = 150;
    this._xUp = e.changedTouches[0].screenX;
    this._yUp = e.changedTouches[0].screenY;
    this._xDif = this._xUp - this._xDown;
    this._yDif = this._yUp - this._yDown;
    try{
      var img = document.getElementById(this._img);
      var left = document.getElementById(this._img_gal_left);
      var right = document.getElementById(this._img_gal_right);
      var gallery = document.getElementById(this._gallery_full);
      img.style.left = "";
      img.style.right = "";
      if(Math.abs(this._yDif) > Math.abs(this._xDif) && (this._st || !this._lr)){
        if(this._st){
          this._st = false;
          this._lr = false;
        }
        if(this._yDif < 0){ //Up
          img.style.margin = ((this._window_h / 2) - (img.offsetHeight / 2)) - Math.abs(this._yDif) + "px auto 0px auto";
          img.style.top = "";
          img.style.bottom = "";
          gallery.style.opacity = 1 - (Math.abs(this._yDif) / threshhold);
          if(Math.abs(this._yDif) >= threshhold){
            this._t = true;
          } else {
            this._t = false;
          }
        } else { //Down

        }
      } else {
        img.style.margin = "auto 0px auto " + (img.style.left + this._xDif) + "px";
        img.fakeleft = img.style.left + this._xDif;
        if(this._st){
          this._st = false;
          this._lr = true;
        }
        if(this._xDif < 0){ //Left
          if(Math.abs(this._xDif) >= threshhold){
            this._l = true;
          } else {
            this._l = false;
          }
        } else { //Right
          if(Math.abs(this._xDif) >= threshhold){
            this._r = true;
          } else {
            this._r = false;
          }
        }
      }
    } catch (err){}
  };

  //setup gets the images for calculating widths
  this.setup = () => {
    this._window_w = window.innerWidth;
    this._window_h = window.innerHeight;

    if(this.mobile_check()){
      this._img_height += 200;
    }
    this.stylings();
    var gallerys = document.getElementsByClassName(this._gallery);
    for (var i=0; i<gallerys.length; i++) {
      if(gallerys[i].id == ""){
        gallerys[i].id = "Gallery_unique_" + i;
      }
      var childs = gallerys[i].childNodes;
      for(var j=0; j<childs.length; j++){
        if(childs[j].tagName == "IMG"){
          var div = document.createElement("div");
          var div_2 = document.createElement("div");
          div.appendChild(childs[j]);
          div.appendChild(div_2);
          div.style.width = "auto";
          div.setAttribute("onclick", this._class_name + ".open_full(this)");
          gallerys[i].appendChild(div);
        }
        if(childs[j].tagName == "DIV"){
          childs[j].style.width = "auto";
        }
      }
    }
    for (var i=0; i<gallerys.length; i++) {
      var width_total = gallerys[i].offsetWidth;
      var width_cur = 0;
      var childs = gallerys[i].children;

      var start = 0;
      for(var j=0; j<childs.length; j++){
        if(childs[j].tagName == "DIV"){
          width_cur += childs[j].offsetWidth + (this._margin * 2) + 1;
          if(width_cur >= width_total){
            this.set_width(childs, start, j, width_cur, width_total, this._min_width);
            var width_cur_2 = 0;
            if(this.mobile_check()){
              for(var n=start; n<j; n++){
                width_cur_2 += childs[j].offsetWidth + (this._margin * 2) + 1;
                if(width_cur_2 >= width_total){
                  this.set_width(childs, start, j, width_cur, width_total, this._min_width);
                }
              }
            }
            width_cur = 0;
            start = j+1;
          }
        }
      }
    }
  };

  //calculates the widths for a row of images
  this.set_width = (children, start, end, width_cur, width_total, min_width) => {
    var sacrifice = [];
    var difference = width_cur - width_total;
    for(var i=start; i<=end; i++){
      if(children[i].offsetWidth - min_width < 0){
        sacrifice.push(0);
      } else {
        sacrifice.push(children[i].offsetWidth - min_width);
      }
    }
    var tot = 0;
    for(var i=0; i<sacrifice.length; i++){
      tot += sacrifice[i];
    }
    for(var i=start, j=0; i<=end; i++, j++){
      if(sacrifice[i] == 0){
      } else {
        children[i].style.width = children[i].offsetWidth - ((sacrifice[j] / tot) * difference);
      }
    }
  };

  //checks for mobile devices (not tablets)
  this.mobile_check = () => {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  //opens the fullscreen gallery view
  this.open_full = (elem) => {
    this._gallery_open = true;
    this.addClass(document.body, this._disable_scroll);
    var elems = this.get_elems(elem.parentNode.childNodes);
    var index = 0;
    for(var i=0; i<elems.length; i++){
      if(elems[i] == elem){
        index = i;
        break;
      }
    }
    var gallery = document.createElement("div");
    var gallery_imgs_index = "";
    var width = 0;
    if(!this.mobile_check()){
      for(var i=0; i<elems.length; i++){
        if(i == index){
          gallery_imgs_index = gallery_imgs_index + "<div class='" + this._index_icon + "' id='" + this._index_current + "' onclick=\"" + this._class_name + ".set_index_full(" + i + ", \'" + elem.parentNode.id + "\')\"><img src='" + elems[i].childNodes[0].src + "' /></div>"
        } else {
          gallery_imgs_index = gallery_imgs_index + "<div class='" + this._index_icon + "' id='' onclick=\"" + this._class_name + ".set_index_full(" + i + ", \'" + elem.parentNode.id + "\')\"><img src='" + elems[i].childNodes[0].src + "' /></div>"
        }
        var rat = elems[i].childNodes[0].offsetHeight / elems[i].childNodes[0].offsetWidth;
        width += this._gallery_index_height;
      }
    }
    var str = "";
    if(!this.mobile_check()){
      str += "<div id='" + this._main + "'><span id='" + this._close + "' onclick='" + this._class_name + ".close_full()'><img style='height: 80%; width: auto;' src='" + this._img_close + "' /></span>";
    }
    gallery.id = this._gallery_full;
    if(index == 0){
      if(!this.mobile_check()){
        str += this.inner_left_right(index+1, elems.length-1, elem);
      }
      this._right_index = index+1;
      this._left_index = elems.length-1;
    } else if(index == elems.length-1){
      if(!this.mobile_check()){
        str += this.inner_left_right(0, index-1, elem);
      }
      this._right_index = 0;
      this._left_index = index-1;
    } else {
      if(!this.mobile_check()){
        str += this.inner_left_right(index+1, index-1, elem);
      }
      this._right_index = index+1;
      this._left_index = index-1;
    }
    this._parent_id = elem.parentNode.id;
    this._index_max = elems.length-1;

    str = str + "<img style='z-index: 1; left: auto; right: -" + this._window_w + "px; top: 0px; bottom: 0px; margin: auto;' src='" + elems[this._left_index].childNodes[0].src + "' id='" + this._img_gal_left + "' />\
    <img style='z-index: 2;' src='" + elems[index].childNodes[0].src + "' id='" + this._img + "' />\
    <img style='z-index: 1; left: -" + this._window_w + "px; right: auto; top: 0px; bottom: 0px; margin: auto;'  src='" + elems[this._right_index].childNodes[0].src + "' id='" + this._img_gal_right + "' />\
    </div><div id='" + this._index + "'><div style='width: " + width + "px'>" + gallery_imgs_index +"</div></div>";

    if(this.mobile_check()){
      gallery.style.backgroundColor = "rgb(0, 0, 0)";
    }
    gallery.innerHTML = str;
    document.body.appendChild(gallery);

    this.set_img_size();
    if(!this.mobile_check()){
      var gal_inner_index = document.getElementById(this._index);
      var current = document.getElementById(this._index_current);
      gal_inner_index.scrollLeft = current.offsetLeft-((this._gallery_index_height*index)/3);
    }
  };

  //sets fullscreen gallery image size
  this.set_img_size = () => {
    var img = document.getElementById(this._img);
    var left = document.getElementById(this._img_gal_left);
    var right = document.getElementById(this._img_gal_right);
    this.calc_img(img);
    this.calc_img(left);
    this.calc_img(right);
    left.style.position = "absolute";
    right.style.position = "absolute";
  };

  //calculate img width and height
  this.calc_img = (elem) => {
    var h = this._gallery_index_height;
    if(this.mobile_check()){
      h = 0;
    }
    var iw = elem.naturalWidth / elem.naturalHeight;
    var ih = elem.naturalHeight / elem.naturalWidth;
    if(elem.naturalWidth >= elem.naturalHeight){
      elem.style.width = this._window_w + "px";
      elem.style.height = ih * this._window_w + "px";
      if(elem.offsetHeight > this._window_h - h){
        elem.style.height = this._window_h - h + "px";
        elem.style.width = iw * (this._window_h - h) + "px";
      }
    } else {
      elem.style.height = this._window_h - h + "px";
      elem.style.width = iw * (this._window_h - h) + "px";
      if(elem.offsetWidth > this._window_w) {
        elem.style.width = this._window_w + "px";
        elem.style.height = ih * (this._window_w);
      }
    }
    if(this.mobile_check()){
      elem.style.position = "absolute";
      if(elem.style.left != ""){
      } else if(elem.style.right != "") {
      } else {
        elem.style.left = "0px";
        elem.style.right = "0px";
      }
    }
    elem.style.top = "0px";
    elem.style.bottom = "0px";
    elem.style.margin = "auto";
  };

  //simplified version of inner div
  this.inner_left_right = (ind_r, ind_l, elem) => {
    return this.inner_div(this._right, ind_r, elem, this._img_right) + this.inner_div(this._left, ind_l, elem, this._img_left);
  };

  //used for creating left and right index items
  this.inner_div = (id, index, elem, img) => {
    return "<div id='" + id + "' onclick=\"" + this._class_name + ".set_index_full(" + index + ", \'" + elem.parentNode.id + "\')\"><img style='width: 40%; height: auto;' src='" + img + "' /></div>";
  }

  //closes the gallery fullscreen mode
  this.close_full = (close=true) => {
    if(close){
      this._gallery_open = false;
      this.removeClass(document.body, "disable_scroll");
    }
    var elem = document.getElementById(this._gallery_full);
    elem.parentNode.removeChild(elem);
  };

  //changes the main image in fullscreen mode
  this.set_index_full = (index, id) => {
    if(index == this._left_index + 1 && index == this._right_index - 1) return;
    if(index == 0 && this._left_index == this._index_max && index == this._right_index - 1) return;
    if(index == this._index_max && index == this._left_index + 1 && this._right_index == 0) return;
    var elems = this.get_elems(document.getElementById(id).childNodes);
    var img = document.getElementById(this._img);
    var left = document.getElementById(this._img_gal_left);
    var right = document.getElementById(this._img_gal_right);
    if(index > this._right_index){
      right.src = elems[index].children[0].src;
      this.calc_img(right);
    } else if(index < this._left_index){
      left.src = elems[index].children[0].src;
      this.calc_img(left);
    }
    var img_w = (this._window_w / 2) - (img.offsetWidth / 2);
    var left_w = (this._window_w / 2) - (left.offsetWidth / 2);
    var right_w = (this._window_w / 2) - (right.offsetWidth / 2);
    img.style.position = "absolute";
    img.style.margin = "auto 0px";
    if(index <= this._left_index && index != this._right_index){ // -->
      if(!this.mobile_check()){
        this.animate_gallery(left,"right","","px",this._window_w,left_w,350, "ease-out");
        this.animate_gallery(img,"left","","px",img_w,this._window_w,350, "ease-out");
      } else {
        this.animate_gallery(left,"right","","px",(parseInt(left.style.right, 10)/(this._window_w-12))+this._window_w,0,250, "ease-out");
        this.animate_gallery(img,"left","","px",parseInt(img.fakeleft, 10),this._window_w,250, "ease-out");
      }
    } else { // <--
      if(!this.mobile_check()){
        this.animate_gallery(right,"left","","px",this._window_w,right_w,350, "ease-out");
        this.animate_gallery(img,"right","","px",img_w,this._window_w,350, "ease-out");
      } else {
        this.animate_gallery(right,"left","","px",(parseInt(right.style.left, 10)/(this._window_w-12))+this._window_w,0,250, "ease-out");
        this.animate_gallery(img,"left","","px",parseInt(img.fakeleft, 10),-this._window_w,250, "ease-out");
      }
    }
    if(!this.mobile_check()){
      setTimeout(() => {this.close_full(false);}, 350);
      setTimeout(() => {this.open_full(elems[index]);}, 350);
    } else {
      setTimeout(() => {this.close_full(false);}, 250);
      setTimeout(() => {this.open_full(elems[index]);}, 250);
    }
  };

  //filters out unwanted elems
  this.get_elems = (elem) => {
    var elems = [];
    for(var i=0; i<elem.length; i++){
      if(elem[i].tagName == "DIV"){
        elems.push(elem[i]);
      }
    }
    return elems;
  };

  //checks if elem has class
  this.hasClass = (elem, className) => {
    if (elem.classList){return elem.classList.contains(className);}
    else {return !!elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));}
  };

  //adds class to elem
  this.addClass = (elem, className) => {
    if (elem.classList){elem.classList.add(className);}
    else if (!hasClass(elem, className)) elem.className += " " + className
  };

  //removes class from elem
  this.removeClass = (elem, className) => {
    if (elem.classList){elem.classList.remove(className);}
    else if (hasClass(elem, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      elem.className = elem.className.replace(reg, ' ')
    }
  };

  //used to animate elements through style
  this.animate_gallery = (elem,style,pre,unit,from,to,time, ease="linear") => {
    if( !elem) return;
    var start = new Date().getTime(),
      timer = setInterval(() => {
        var step = Math.min(1,(new Date().getTime()-start)/time);
        elem.style[style] = pre+(from+(this.easeing(ease, step))*(to-from))+unit;
        if( step == 1) clearInterval(timer);
      },0);
    elem.style[style] = pre+from+unit;
  };

  //input 0 <= x <= 1, output 0 <= x <= 1
  this.easeing = (type, x) => {
    switch (type) {
      case "linear":
        return x;
      case "ease-in":
        return Math.sin(((x-1)*Math.PI)/2)+1;
      case "ease-out":
        return Math.sin((x*Math.PI)/2);
      case "ease-in-out":
        return (1/2)*Math.sin((((2*x)-1)*Math.PI)/2)+(1/2);
      case "ease-out-sharp":
        return Math.sqrt(1-Math.pow((x-1), 2));
      case "ease-in-sharp":
        return -Math.sqrt(1-Math.pow(x, 2))+1;
      case "ease-in-out-sharp":
        if(x < 1/2){
          return -(1/2)*Math.sqrt(1-Math.pow((2*x), 2))+(1/2);
        } else {
          return (1/2)*Math.sqrt(1-Math.pow(((2*x)-2), 2))+(1/2);
        }
      default:
        return x;
    }
  };

  //applies default css
  this.stylings = () => {
    if(this._initial){
      return;
    }
    var string = "\
    ." + this._gallery + " {\
      height: 100%;\
      display: table;\
    }\
    ." + this._gallery + " > div {\
      height: " + this._img_height + "px;\
      margin: " + this._margin + "px;\
      cursor: pointer;\
      position: relative;\
      float: left;\
      overflow: hidden;\
      display: flex;\
      justify-content: center;\
    }\
    ." + this._gallery + " > div > img {\
      height: 100%;\
    }\
    ." + this._gallery + " > div > div {\
      top: 0;\
      left: 0;\
      right: 0;\
      bottom: 0;\
      position: absolute;\
    }\
    ." + this._gallery + " > div > div:hover {\
      background: rgba(117, 117, 117, 0.5);\
    }\
    ." + this._gallery + "::after {\
      content: \"\"\
      visibility: hidden;\
      width: 50%;\
      height: 100%;\
    }\
    ." + this._index_icon + " {\
      cursor: pointer;\
    }\
    ." + this._disable_scroll + " {\
      height: 100%;\
      overflow: hidden;\
    }\
    #" + this._gallery_full + " {\
      width: 100%;\
      height: 100%;\
      position: fixed;\
      z-index: 2;\
      top: 0px;\
      left: 0px;\
      background-color: rgba(0, 0, 0, 0.75);\
    }\
    #" + this._main + " {\
      width: 100%;\
      height: calc(100% - " + this._gallery_index_height + "px);\
      display: flex;\
      justify-content: center;\
      position: relative;\
    }\
    #" + this._close + " {\
      z-index: 4;\
      font-size: 2em;\
      color: black;\
      position: absolute;\
      border-radius: 5px;\
      right: 0px;\
      margin: 5px;\
      width: 40px;\
      height: 40px;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      cursor: pointer;\
      background-color: rgba(255, 255, 255, 0.5);\
    }\
    #" + this._close + ":hover {\
      background-color: rgba(117, 117, 117, 1);\
    }\
    #" + this._right + " {\
      position: absolute;\
      border-radius: 10px;\
      top: calc(35% + " + this._gallery_index_height + "px);\
      right: -10px;\
      width: 120px;\
      height: 20%;\
      margin: auto 0px;\
      z-index: 3;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      position: absolute;\
      cursor: pointer;\
      background: rgba(0, 0, 0, 0.5);\
    }\
    #" + this._right + ":hover{\
      background-color: rgba(117, 117, 117, 0.5);\
    }\
    #" + this._left + " {\
      position: absolute;\
      border-radius: 10px;\
      top: calc(35% + " + this._gallery_index_height + "px);\
      left: -10px;\
      width: 120px;\
      height: 20%;\
      margin: auto 0px;\
      z-index: 3;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      position: absolute;\
      cursor: pointer;\
      background: rgba(0, 0, 0, 0.5);\
    }\
    #" + this._left + ":hover{\
      background-color: rgba(117, 117, 117, 0.5);\
    }\
    #" + this._index + " {\
      height: " + this._gallery_index_height + "px;\
      width: 100%;\
      position: absolute;\
      text-align: center;\
      overflow-x: auto;\
      overflow-y: hidden;\
      text-align: center;\
      z-index: 2;\
      bottom: 0px;\
    }\
    #" + this._index + " > div {\
      height: 100%;\
      position: relative;\
      text-align: center;\
      display: inline-block;\
    }\
    #" + this._index + " > div > div {\
      height: " + (this._gallery_index_height-10) + "px;\
      width: " + (this._gallery_index_height-10) + "px;\
      margin: 5px;\
      overflow: hidden;\
      opacity: 0.25;\
      display: inline-block;\
    }\
    #" + this._index + " > div > div:hover {\
      opacity: 1;\
    }\
    #" + this._index_current + " {\
      opacity: 1 !important;\
    }\
    #" + this._index + " > div > div > img {\
      width: auto;\
      height: 100%;\
    }\
    div::-webkit-scrollbar {\
      opacity: 0;\
      width: 2.5px;\
      height: 2.5px;\
    }\
    div::-webkit-scrollbar-track {\
      opactiy: 0;\
    }\
    div::-webkit-scrollbar-thumb {\
      background-color: darkgrey;\
    }\
    ";
    var elem = document.createElement("style");
    elem.innerHTML = string;
    document.body.appendChild(elem);
    this._initial = true;
  };

};

//
// If you cange the name of the class from 'Gallery' to something else
//  be sure to change the 'Gallery' here as well
//
//
//handles touch events
document.addEventListener('touchstart', Gallery.handleTouchStart, false);
document.addEventListener('touchmove', Gallery.handleTouchMove, false);
document.addEventListener('touchend', Gallery.handleTouchEnd, false);

//sets up the scripts
window.addEventListener('resize', Gallery.setup, false);
window.addEventListener('load', Gallery.setup, false);
