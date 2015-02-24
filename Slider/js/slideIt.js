//1. Create Dom.
//2. Find first elements
//3. Slide on next element ++
//4. Return to the first element
//5. OnClick set delay and then return to slide images

'use strict';
$(function(){
function Slider(node,speed,delay) {
    this.node = node;
    this.slides = ['img/image1.jpg','img/image2.jpg','img/image3.jpg','img/image4.jpg'];                 // Array of images
    this.obj = 0;                                                                                        // First element
    
    this.domCreation = function() {                                                                        // Function for dom creation
        $(this.node).prepend('<div class="main">');
        $(this.node).find('.main').append('<div>');
        $(this.node).find('.main>div').addClass('bar');
        $(this.node).find(".main .bar").after('<div>');
        $(this.node).find(".main" ).find('div').eq(1).addClass('slider');
        $(this.node).find('.bar').append('<ul>');
        for (var i = 0; i < 4; i+=1) {
           $(this.node).find('.bar ul').append('<li>')
           $(this.node).find('.bar li').eq(i).attr('id', i);
            if(i===0){
                $(this.node).find('.bar li').eq(i).addClass('active');
            }
        }
        $(this.node).find('.slider').append('<ul>');
        for (var i = 0; i < 4; i+=1) {
            $(this.node).find('.slider ul').append('<li>')
            $(this.node).find('.slider li').eq(i).append('<img>');
            $(this.node).find('.slider li>img').eq(i).addClass('slide'+i).attr('src',this.slides[i]);
        }
  };
Slider.prototype.slide = function (object, slideElement) { 
    var ul = $(this.node).find(slideElement).find("ul").eq(1);                                      // Finding block
    var bl = $(this.node).find(slideElement).find("li>.slide"+object);                              // Finding current block
    var _width = $(this.node).find(bl).width();                                                     // Widht of object
    $(ul).stop().animate({marginLeft: "-"+_width*object}, 500);                                     // 500 - speed of slidings
}


Slider.prototype.autoSlide = function (object) {
    var ul =  $(this.node).find('.main').find("ul").eq(1);                                          // Finding block
    var bl =  $(this.node).find('.main').find("li>.slide"+object);                                  // Finding current block
    var _width = $(bl).width();                                                                     // Widht of object
     $(this.node).find('.bar').find("li").removeClass("active"); 
     $(this.node).find('.bar').find("li").eq(object).addClass('active'); 
    $(ul).stop().animate({marginLeft: "-"+_width*object}, 500);                                     // 500 - speed of slidings   
}


    var _th=this;
   
    $(document).on("click", ".main .bar li", function() {                                          // On click event
    _th.slideElement =  $(_th.node).find(this).closest(".main");                                   // Find, where was click(block)
    $(_th.node).find(_th.slideElement).find("li").removeClass("active");                           // Delete active element
    $(_th.node).find(this).addClass("active");                                                     // Set active element
    _th.obj = $(_th.node).find(this).attr("id");                                                   // Number of active element
    _th.slide(_th.obj, _th.slideElement);                                                          // Slide to the next
    clearInterval(_th.timer);
    clearTimeout(_th.timerId);
    _th.timerId = setTimeout(function() {
            _th.timer = setInterval(function() { 
                if(_th.obj>=3){
                    _th.obj=-1;
                }
                _th.autoSlide(++_th.obj) }, speed);
        }, delay);   
    return false;
    });
    _th.timerId = setTimeout(function() {
            _th.timer = setInterval(function() { 
                if(_th.obj>=3){
                    _th.obj=-1;
                }
                _th.autoSlide(++_th.obj) }, speed);
        }, 10);
    this.domCreation();                                                                              // Dom initialization

};




var Slider1 = new Slider('body',1500,2000);                                                           //Slider initialization
}());