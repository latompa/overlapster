
boardWidth  = 500;
boardHeight = 500;


currentLevel = 1;
connections = {
  1:  [[0,1],[1,3],[2,3],[0,2]],
  2:  [[0,1],[1,2],[2,3],[3,4], [4,0]]
}

tiles = {};

function initBoard() {
   board = document.getElementById('board');
   bg = document.getElementById('background').getContext('2d');
}

function updateStatus() {
  $('#status').text('dragging');
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
		  updateStatus();
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
  bg.clearRect(0,0,500,500);
}

function drawLines() {
  clearBoard();
  bg.strokeStyle = "#999963";
  bg.lineWidth = 3;
  bg.stroke();
  centerXAdjust = 25;
  centerYAdjust = 25;
  
  $(connections[currentLevel]).each(function(i,connection) {
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
  addTiles(connections[level].length);
  drawLines();
}

function finishLevel() {
  disableDraggable();
  $(board).append("<div class='congrats_bg'><div class='congrats'><h1>Yey! Level 2 solved</h1><p><a href='#' class='next'>Continue to level 3</a></p></div></div>"); 
  $('.next').click(function(){startLevel(currentLevel+1)});
}

function checkOverlap() {
  var tangled=false;
  currentConnections = connections[currentLevel];
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
  initBoard();
  startLevel(currentLevel);
  drawLines();
});
