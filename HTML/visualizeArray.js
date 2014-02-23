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

//window.addEventListener('resize', resizeGame, false);
//window.addEventListener('orientationchange', resizeGame, false);
//resizeGame();

////

/* generate a random array and call visualizeArray with it.
setInterval(function(){
    var array = [];
    for (var i=0;i<100;i++){
        array.push(Math.random())
    }
    visualizeArray(array);
},500);
*/        
function visualizeArray(array){
    var ee = ">>visualizeArray: "; //console log cursor
    if (!(array instanceof Array)){
        alert("input error: visualizeArray")
        return;
    }
    
    var canvas = document.getElementById("gameCanvas");
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
                var red = 255//*(count/arrlen);
                var green = Math.round(array[count]*255)
                var blue = "0";
                context.fillStyle="rgb("+red+","+green+","+blue+")"; //function that returns color
                context.fillRect(c*boxwidth, r*boxheight, boxwidth-1, boxheight-1)
            }
        }
    }
    //console.log(ee+ "drawtime: "+(Date.now()-d)+" ms"); 
}

function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var w = canvas.width;
  canvas.width = 1;
  canvas.width = w;
}

/*
context.beginPath();
context.moveTo(0, 40);
context.lineTo(240, 40);
context.strokeStyle = "#000";
context.stroke();
*/
/*
var my_gradient = context.createLinearGradient(0, 0, 300, 0);
my_gradient.addColorStop(0, "black");
my_gradient.addColorStop(1, "white");
context.fillStyle = my_gradient;
context.fillRect(0, 0, 300, 225)
*/


////