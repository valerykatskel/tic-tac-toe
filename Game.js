'use strict';
/** 
 * GameBoard Class
 **/
var Board = (function(){
	function Board (){
    // create container for game board
		this.container = document.createElement('div');
		this.container.setAttribute('id', 'gameBoard');
    this.cleanBoard = true;
    this.gameOver = false;
    document.body.appendChild(this.container);

		this.row = []; // create array of rows
		this.cell = []; // create array of cells
		
    // create 19x19 game board
		for (var i = 0; i < 19; i++){
			this.row[i] = document.createElement('div');
			this.row[i].setAttribute('id', 'row' + i);
			this.row[i].setAttribute('class', 'row');
			this.container.appendChild(this.row[i]);

			for (var j = 0 + 19 * i; j < 19 + 19 * i; j++){
				this.cell[j] = new Cell(j, 'row' + i, 'cell');
			}
		}
    
    window.boardCell = this.cell;
    window.board = this;
	}
	
	// methods of class Board
	Board.prototype = { 
    clearBoard : function () {
      for (var i = 0; i < 19; i++){
        for (var j = 0; j < 19; j++){
          window.boardCell[i * 19 + j].clearCell();
        }
      } 
      this.cleanBoard = true;      
    },
    getCell : function (id){
      return window.boardCell[id];
    },  
		// setMarker - method to add eigher cross or circle to the cell
		setMarker : function (activeCell){
      
      var type = activeCell.markerType;
      var canvas = activeCell.canvas;
      var cell = canvas.getContext('2d');
      
      canvas.setAttribute('title', player[currentPlayer].name + '\'s marker');
      debugger
      gameBoard.cleanBoard = false;
      
			switch (type){
        case 'cross': 
          cell.beginPath();
          cell.lineWidth = 2;
          cell.strokeStyle = 'red';
          cell.moveTo(4, 4);
          cell.lineTo(16, 16);
          cell.moveTo(16, 4);
          cell.lineTo(4, 16);
          cell.stroke();
        break;
        case 'circle':
          cell.beginPath();
          cell.arc(10, 10, 6, 0, 2*Math.PI, false);
          cell.fillStyle = 'white';
          cell.fill();
          cell.lineWidth = 2;
          cell.strokeStyle = 'blue';
          cell.stroke();
        break;
      }
		},   
    checkWin : function (activeCell, showAlert) {
      showAlert = typeof(showAlert) != 'undefined' ? showAlert : true;
      var markerType = activeCell.markerType;
      var ctx = activeCell.canvas.getContext('2d');
      
      // check horizontal and vertical lines
      var horLine = 0; 
      var verLine = 0;
      for (var i = 0; i < 19; i++){
        for (var j = 0; j < 19; j++){
          if (window.boardCell[i * 19 + j].markerType === markerType) {
            horLine++; 
          } else {
            horLine = 0;
          }
          if (window.boardCell[j * 19 + i].markerType === markerType) { 
            verLine++; 
          } else {
            verLine = 0;
          }
          if (horLine === 5 || verLine === 5) { 
            if (showAlert) window.alert(player[currentPlayer].name + ' (' + player[currentPlayer].marker + ')' + ' won!!!');
            this.gameOver = true;
            horLine = 0;
            verLine = 0;
            window.board.clearBoard(ctx);
          }
        }
      }
      
      // check diagonals
      var mdig = 0; 
      for (var n = 0; n < 19; n++){
        for (var k = 0; k < 19; k++){
          for (var l = 0; l < 19; l++){
            var digCellNum = 19 * n + k + 20 * l;
            if (digCellNum < (19 - k) * 19) {
              if (window.boardCell[digCellNum].markerType === markerType) {
                mdig++; 
              } else {
                mdig = 0;
              }
            }  
            if (mdig === 5) {
              if (showAlert) window.alert(player[currentPlayer].name + ' (' + player[currentPlayer].marker + ')' + ' won!!!');
              this.gameOver = true;
              mdig = 0;
              window.board.clearBoard(ctx);
            }            
          }
        }
      }  
      var supdig = 0;
      for (var o = 0; o < 19; o++){
        for (var p = 18; p >= 0; p--){
          for (var s = 0; s < 19; s++){
            var supdigCellNum = 19 * o + p + 18 * s;
            if (supdigCellNum <= p * 19) {
              if (window.boardCell[supdigCellNum].markerType === markerType) {
                supdig++; 
              } else {
                supdig = 0;
              }
            }  
            if (supdig === 5) {
              if (showAlert) window.alert(player[currentPlayer].name + ' (' + player[currentPlayer].marker + ')' + ' won!!!');
              this.gameOver = true;
              supdig = 0;
              window.board.clearBoard(ctx);
            }            
          }
        }
      }  
    }    
	};
	
	return Board;
})();

/**
 * Player Class
 * @param: 
 *   playerName (string) - players name
 *   playerType (enum Player) - type of player, either first player or second player.
 *   playerMarker - type of marker, which player put in cell.
 **/
function Player(playerName, playerType, playerMarker){
	this.name = playerName;
	this.type = playerType;
	this.marker = playerMarker;
}

/** 
 * Cell Class
 **/
var Cell = (function(){
	function Cell(id, parent_id, classes){
		// Get the new cells parent row DIV element from the DOM
		var parent = document.querySelector('#' + parent_id);
		
		this.canvas = document.createElement('canvas'); // canvas for one of 19 game cells.
		this.canvas.setAttribute('id',id); // set id for the cells canvas
		this.canvas.setAttribute('width',20); // set width for the cells canvas
		this.canvas.setAttribute('height',20); // set height for the cells canvas
		this.canvas.setAttribute('class',typeof classes === 'string' ? classes : ''); // add any classes to the cells canvas
		parent.appendChild(this.canvas); // Final display the new cell
		
		// Store passed parameters in corresponding object properties
		this.parent_id = parent_id; // the parent row DIV id for the cell.
		this.id = id; // id of name game cell.
		this.owner = null; // Store which player owners this cell.
    this.markerType = null; // type of marker    
      
		// Add event listener to canvas
		this.canvas.addEventListener('click',this,false);
	}
	
	// method of class Cell
	Cell.prototype = {
		handleEvent : function(e){
			switch (e.type){
				case 'click' : 
					if( this.owner === null ){
						this.owner = currentPlayer;
            this.markerType = player[currentPlayer].marker;
						
						Board.prototype.setMarker(this);

            Board.prototype.checkWin.call(this, this);
            
            // Start the opponents turn
            currentPlayer = currentPlayer === Players.first ? Players.second : Players.first;
					}
				break;
			}
		},
    clearCell : function (){
      var ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.owner = null; // Store which player owners this cell.
      this.markerType = null; // type of marker   
    }
	};
	
	return Cell;
})();


	
// Enum for type of players
var Players = {first : 0, second : 1};
// Set the DEFAULT PLAYER as first player to start the game
var currentPlayer = Players.first;
var player = [];

window.onload = function () {	
	// Create new player
	player = [
    new Player(
      'The first player', 
      Players.first, 
      'cross'
    ),
    new Player(
      'The second player', 
      Players.second, 
      'circle'
    )
  ];
	
	// Create Game Baard
	var gameBoard = new Board();
};