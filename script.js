document.addEventListener('DOMContentLoaded', function() {
  const x = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L100,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke1"/><path d="M100,0 L0,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke2"/></svg>`;
  const o = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" stroke="black" stroke-width="5" fill="none" class="animated-circle"/></svg>`;

  // board object stores, records and returns moves from boardArray array
  const board = function()  {
    let boardArray = []
    
    function recordMove(move) {
      boardArray.push(move);
      console.log('Move added to board:', move);
    }
    
    function returnMoves() {
      console.log('Current board state:', boardArray);
      return [...boardArray]; 
    }
    
    function lastMove() {
      return boardArray.at(-1)
    }
    
    return { recordMove, returnMoves, lastMove };
  }();
  
  function uiController() {
    const cells = document.querySelectorAll('#board-grid > div');
    const instructions = document.getElementById('instructions');
    
    function lastMoveCell() {
      return document.querySelector(`[data-cell-position="${board.lastMove}"]`);
    }

    function displayMove() {
      let cell = lastMoveCell();
      cell.insertAdjacentHTML('beforeend', game.activePlayer.symbol);
      cell.removeEventListener('click', processMove);
      cell.style.cursor = 'default';
    }

    return { displayMove }
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', processMove);
  })
  
  function processMove(event) {
    console.log('processMove triggered for:', event.target);
    let cellPosition = event.srcElement.dataset.cellPosition;
    board.recordMove(cellPosition);
    board.returnMoves();
    board.displayMove();
  }

  function createPlayer(symbol) {
    const symbol = symbol;
    const getSymbol = () => symbol;

    return { getSymbol }; 
  };


  function GameController() {
    const player1 = createPlayer('x');
    const player2 = createPlayer('o');
    let activePlayer = player1;
    const changeActivePlayer = () => {
      activePlayer = activePlayer === player1 ? player2 : player1;
    };
    const getActivePlayer = ()  => activePlayer;

    return { getActivePlayer, changeActivePlayer };
  };


  const game = GameController()

})