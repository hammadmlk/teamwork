"use strict"

/*
* This function draws a grid on a canvas 
* The array elements are either -1 or 0 or 1 or 2.
* Each value has a different colour associated with
* it when drawing the grid 
*
*/
function visualizeArray(array, canvas){
    var ee = ">>visualizeArray: "; //console log cursor
    if (!(array instanceof Array)){
        alert("input error: visualizeArray")
        return;
    }
    
    //todo: check for valid canvas obj
    
    var context = canvas.getContext("2d");
      
    var arrlen = array.length;        
   
    // calc num of cols and rows in approx ratio 4:3
    var cols = Math.ceil(Math.sqrt((4/3)*(arrlen)))
    var rows = Math.ceil(arrlen/cols)
    
    //console.log(ee+"cols: "+ cols + "  rows: " + rows);
  
    var boxwidth = canvas.width/cols
    var boxheight = canvas.height/rows
    
    var d = Date.now();
    
    var count=0;
    clearCanvas(context, canvas)// clear canvas
    for (var r=0;r<rows;r++){
        for (var c=0;c<cols;c++){
            if (count<arrlen){
                count++;
                var red, green, blue;
                if (array[count]==-1){  //white
                    red = 255; green=255; blue =255; 
                }else if (array[count] ==0){    //yellow
                    red = 255; green=255; blue =0;
                }else if (array[count] ==1){    //green
                    red = 0; green=255; blue =0;
                }else if (array[count] ==2){    //red
                    red = 255; green=0; blue =0;
                }
               
                context.fillStyle="rgb("+red+","+green+","+blue+")"; //function that returns color
                context.fillRect(c*boxwidth, r*boxheight, boxwidth-1, boxheight-1)
            }
        }
    }
    //console.log(ee+ "drawtime: "+(Date.now()-d)+" ms"); 
    
    // erases all the content on canvas
    function clearCanvas(context, canvas) {
      "use strict"
      context.clearRect(0, 0, canvas.width, canvas.height);
      var w = canvas.width;
      canvas.width = 1;
      canvas.width = w;
    }
}

/* generate a random array and call visualizeArray with it.
 * used for unit testing of visualizeArray function
setInterval(function(){
    var array = [];
    for (var i=0;i<100;i++){
        array.push(Math.round(Math.random()*4-1)) // a rand int -1 to 3
    }
    var CANVAS = document.getElementById("visualizeCanvas");
    visualizeArray(array, CANVAS);
},500);
*/        


/*
// how to draw a line on canvas
context.beginPath();
context.moveTo(0, 40);
context.lineTo(240, 40);
context.strokeStyle = "#000";
context.stroke();
*/
/*
// how to fill gradient on canvas
var my_gradient = context.createLinearGradient(0, 0, 300, 0);
my_gradient.addColorStop(0, "black");
my_gradient.addColorStop(1, "white");
context.fillStyle = my_gradient;
context.fillRect(0, 0, 300, 225)
*/


////
/*
 * resizes the canvas based on window size
 * resize listeners can call this function to resize the canvas automatically
function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}
// resize listeners being attached to resizeGame function
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
resizeGame();
*/
////