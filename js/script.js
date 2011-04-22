boardWidth  = 500;
boardHeight = 500;
tileWidth =50;
tileHeight =50;

currentLevel = 1;
tiles = {};

function initBoard() {
   board = document.getElementById('board');
   background = document.getElementById('background');
   bg = background.getContext('2d');
   boardWidth = $(background).width();
   boardHeight = $(background).height();
}

function addTiles(numTiles) {
  for(i=0;i<numTiles;i++) {
    unitX = Math.cos(Math.PI*2*i/numTiles); unitY = Math.sin(Math.PI*2*i/numTiles);
    scaleX = boardWidth/2.5; scaleY = boardHeight/2.5;
    transX = unitX*scaleX  + (boardWidth/2); transY = unitY*scaleY  + (boardHeight/2);
    addTile(i,transX, transY);
  }
}

function addTile(index,x,y) {
  tile = document.createElement('canvas');
  $(tile).addClass('tile');
  tile.style['top']  = x + "px";
  tile.style['left'] = y + "px";
  board.appendChild(tile);
  
  $(tile).draggable({ 
    containment: "parent",  
    drag: function() {
      $(this).addClass('dragging');
      drawLines();
	  },
	  stop: function() {
	    checkOverlap();
	    $(this).removeClass('dragging');
	    drawLines();
	  }
  });
  tiles[i] = tile;
}

function clearBoard() {
  bg.beginPath();
  bg.clearRect(0,0,boardWidth,boardHeight);
}

function drawLines() {
  clearBoard();
  bg.strokeStyle = "#999963";
  bg.lineWidth = 3;
  bg.stroke();
  centerXAdjust = tileWidth/2;
  centerYAdjust = tileHeight/2;
  
  $(levels[currentLevel].connections).each(function(i,connection) {
    tileA = tiles[connection[0]];
    tileB = tiles[connection[1]];
    bg.moveTo(parseInt(tileA.style.left) + centerXAdjust, parseInt(tileA.style.top) + centerYAdjust);
    bg.lineTo(parseInt(tileB.style.left) + centerXAdjust, parseInt(tileB.style.top) + centerYAdjust);
    bg.stroke();
  });
}

function disableDraggable() {
  $('.tile').draggable({disabled: true});
}

function startLevel(level) {
  currentLevel=level;
  $('.tile').remove();
  $('.congrats_bg').remove();
  clearBoard();
  addTiles(levels[currentLevel].numTiles);
  drawLines();
}

function finishLevel() {
  disableDraggable();
  $(board).append("<div class='congrats_bg'><div class='congrats'><h1>Yey! Level "+currentLevel+" solved</h1><p><a href='#' class='next button'>Continue to level "+(currentLevel+1)+"</a></p></div></div>"); 
  $('.next').click(function(){startLevel(currentLevel+1)});
}

function checkOverlap() {
  var tangled=false;
  currentConnections = levels[currentLevel].connections;
  outer: for(var i=0;i<currentConnections.length; i++) {

    firstMarker=tiles[currentConnections[i][0]];
    secondMarker=tiles[currentConnections[i][1]]

    var a1x= parseInt(firstMarker.style.left);
    var a1y= parseInt(firstMarker.style.top);
    var a2x= parseInt(secondMarker.style.left);
    var a2y= parseInt(secondMarker.style.top);

    // check against the other currentConnections
    for(var j=i;j<currentConnections.length; j++) {

      firstMarker=tiles[currentConnections[j][0]];
      secondMarker=tiles[currentConnections[j][1]]

      var b1x= parseInt(firstMarker.style.left);
      var b1y= parseInt(firstMarker.style.top);
      var b2x= parseInt(secondMarker.style.left);
      var b2y= parseInt(secondMarker.style.top);

      if(intersectLineLine(a1x,a1y,a2x,a2y,b1x,b1y,b2x,b2y) == true) {
        tangled=true;
        break outer;
      } 
    }
  }
  if(tangled == true) {
    $('#status').text('tangled');
  } else {
    $('#status').text('free!');
    finishLevel();
  }
}


$(function(){
  $('.start').click(function () {
    $('#instructions').hide();
    initBoard();
    startLevel(currentLevel);
    drawLines();  
  });
});
