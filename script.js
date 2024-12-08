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
    
    function updateDialogue(text) {
      document.getElementById('dialogue').textContent = text;
    }

    function addWinBackground(moves) {
      moves.forEach((move) =>
        document.querySelector(`[data-cell-position="${move[0]}"]`).style.background = 'green'
      );
    }

    function addRestartButton() {
      let btn = document.createElement('button');
      btn.className = "restart-btn"
      btn.textContent = "Play again";
      document.getElementById('game-info').appendChild(btn);
      btn.addEventListener('click', () => {
        location.reload();
      });
    };

    function removeListeners() {
      document.querySelectorAll('#board-grid > div').forEach((cell) => 
        cell.removeEventListener('click', processMoveHandler)
      );
    }

    return { displayMove, updateDialogue, addWinBackground, removeListeners, addRestartButton }
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
    let winningMoves = [];
    
    function setWinningMoves(moves) {
      winningMoves = moves;
    }
    
    function getWinningMoves() {
      return winningMoves;
    }

    function checkRow() {
      const rows = [1, 2, 3].map((row) =>
        activePlayersMoves.filter((move) => move[0].at(0) === String(row))
      );
      const winningRow = rows.filter(row => row.length === 3);
      
      if (winningRow.length > 0) {
        console.log(winningRow.flat());
        setWinningMoves(winningRow.flat())
      };
    };

    function checkColumn() {
      const cols = [1, 2, 3].map((col) =>
        activePlayersMoves.filter((move) => move[0].at(-1) === String(col))
      );
      const winningCol = cols.filter(col => col.length === 3);
      
      if(winningCol.length > 0) {
        console.log(winningCol.flat());
        setWinningMoves(winningCol.flat())
      };
    };
    
    function checkDiagonal() {
      let diagWins = [['1-1', '2-2', '3-3'], ['1-3', '2-2', '3-1']];
      diagWins.forEach((combo) => {
        let matchingMoves = activePlayersMoves.filter((playersMove) => {
          return combo.includes(playersMove[0]);
        })

        if (matchingMoves.length === combo.length) {
          console.log(matchingMoves);
          setWinningMoves(matchingMoves);
        }
      });
    };

    function hasWin() {
      if(activePlayersMoves.length > 2) {
        checkRow();
        checkColumn();
        checkDiagonal();
      }
      return winningMoves.length > 0;
    };

    return { hasWin, getWinningMoves }
  };

  // ####################### Game Controller #############################
  function gameController() {
    const ui = uiController();
    const player1 = createPlayer('x', 1);
    const player2 = createPlayer('o', 2);
    let activePlayer = player1;
    let gameOver = false;
    
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
      
      let gameState = winChecker(board, symbol)
      if (gameState.hasWin()) {
        let winningMoves = gameState.getWinningMoves();
        ui.addWinBackground(winningMoves); // highlight background of winning 
        ui.updateDialogue(`Player no; ${getActivePlayer().getNumber()}, with symbol; ${symbol} wins the game`)
        gameOver = true;
        ui.addRestartButton();
      } else {
        changeActivePlayer();
        ui.updateDialogue(`Player ${getActivePlayer().getNumber()}'s turn.`);
      };
    }

    function isGameOver() {
      return gameOver;
    }
    
    return { getActivePlayer, changeActivePlayer, processMove, isGameOver };
  };
  
  // ####################### Game set up & start #############################
  function startGame() {
    const game = gameController()
    document.getElementById('dialogue').textContent = `Player ${game.getActivePlayer().getNumber()}'s turn.`;
    document.getElementById('dialogue').style.cursor = 'default';
    const cells = document.querySelectorAll('#board-grid > div');
   
    function processMoveHandler(event) {
      const cell = event.currentTarget;
      game.processMove(event);
      cell.removeEventListener('click', processMoveHandler);
      cell.style.cursor = 'default';
  
      if (game.isGameOver()) {
        removeListeners();
      }
    }

    cells.forEach((cell) => {
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', processMoveHandler);
    });

    function removeListeners() {
      cells.forEach((cell) => {
        cell.removeEventListener('click', processMoveHandler);
        cell.style.cursor = 'default';
      });
    }
  };
  
  // ####################### Initialisation #############################
  const startEl = document.getElementById('dialogue');
  if(startEl) {
    startEl.addEventListener('click', startGame);
  };
  
  
})
