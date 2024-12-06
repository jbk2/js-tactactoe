document.addEventListener('DOMContentLoaded', function() {
  // ####################### Board module #############################
  const board = function()  {
    let boardArray = []
  
    function recordMove(move) {
      boardArray.push(move);
    }
    
    function returnMoves() {
      return [...boardArray]; 
    }
    
    return { recordMove, returnMoves };
  }();
  
  // ####################### UI Controller #############################
  function uiController() {
    function displayMove(cell, symbol) {
      const x = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L100,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke1"/><path d="M100,0 L0,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke2"/></svg>`;
      const o = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" stroke="black" stroke-width="5" fill="none" class="animated-circle"/></svg>`;
      let uiCell = document.querySelector(`[data-cell-position="${cell}"]`);
      let svg = symbol === 'x' ? x : o;
      uiCell.innerHTML = svg;
    }
    
    function updateInstructions(text) {
      document.getElementById('instructions').innerHTML = text;
    }

    function updatePlayerNumber(number) {
      document.getElementById('player-number').innerHTML = number;
    }

    return { displayMove, updatePlayerNumber, updateInstructions }
  };
  
  // ####################### Player Factory #############################
  function createPlayer(symbol, number) {
    return {
      getSymbol: () => symbol, 
      getNumber: () => number
    };
  };

  // ####################### Win Checker #############################
  function winChecker(board, symbol) {
  
    let activePlayersMoves = board.returnMoves().filter((move) => move[1] === symbol)
    
    if(activePlayersMoves.length > 2) {
      checkRow()
      checkColumn()
    }

    
    function checkRow() {
      const rows = [1, 2, 3].map((row) =>
        activePlayersMoves.filter((move) => move[0].at(0) === String(row))
      );

      const winningRow = rows.filter(row => row.length === 3)
      
      if (winningRow) {
        console.log("we have a win - " + winningRow)
        return winningRow
      };
    };

    function checkColumn() {
      let col1 = activePlayersMoves.filter((move) => move[0].at(-1) === '1');
      let col2 = activePlayersMoves.filter((move) => move[0].at(-1) === '2');
      let col3 = activePlayersMoves.filter((move) => move[0].at(-1) === '3');
      if(col1.length === 3 || col2.length === 3 || col3.length === 3) {
        console.log("yes there's a col win");
        return "yes there's a col win";
      };
    };
    function checkDiagonal() {

    };
    function hasWin() {

    };
    // return { hasWin }
  };

  
  // ####################### Game Controller #############################
  function gameController() {
    const ui = uiController();
    const player1 = createPlayer('x', 1);
    const player2 = createPlayer('o', 2);
    let activePlayer = player1;
    
    const changeActivePlayer = () => {
      activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const getActivePlayer = ()  => activePlayer;
    
    function processMove(event) {
      let cellPosition = event.srcElement.dataset.cellPosition;
      let symbol = activePlayer.getSymbol()
      let moveData = [cellPosition, symbol];
      
      board.recordMove(moveData);
      ui.displayMove(cellPosition, symbol);
      
      winChecker(board, symbol)
      // if(winChecker(board, symbol).hasWin) {
        // Add animated background to winning cells
        // update UI text & present pop up animation
        // break
      // };
      // check for game win, if so update dialogue UI 
      // console.log(board.returnMoves());
      
      changeActivePlayer();
      ui.updatePlayerNumber(getActivePlayer().getNumber());
    }
    
    return { getActivePlayer, changeActivePlayer, processMove };
  };
  
  // ####################### Start Game Set up #############################
  function startGame() {
    document.getElementById('start-game').remove();
    const game = gameController()
    const cells = document.querySelectorAll('#board-grid > div');
    
    cells.forEach((cell) => {
      cell.style.cursor = 'pointer';
      const processMoveHandler = (event) => {
        game.processMove(event);
        cell.removeEventListener('click', processMoveHandler)
        cell.style.cursor = 'default';
      }
      cell.addEventListener('click', processMoveHandler);
    });
  };
  
  // ####################### Initialisation #############################
  const startEl = document.getElementById('start-game');
  if(startEl) {
    startEl.addEventListener('click', startGame);
  };
  
  
})