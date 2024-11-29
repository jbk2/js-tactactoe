document.addEventListener('DOMContentLoaded', function() {
  const redX    = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L100,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke1"/><path d="M100,0 L0,100" stroke="red" stroke-width="5" fill="none" stroke-dasharray="142" stroke-dashoffset="142" id="stroke2"/></svg>`;
  const blackCircle = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" stroke="black" stroke-width="5" fill="none" class="animated-circle"/></svg>`;

  let cells = document.querySelectorAll('#board-grid > div');
  
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

    function displayMove() {
      let matchingCell = document.querySelector(`[data-cell-position="${boardArray[boardArray.length - 1]}"]`);
      matchingCell.insertAdjacentHTML('beforeend', blackCircle);
      matchingCell.removeEventListener('click', processMove);
      matchingCell.style.cursor = 'default';
    }

    return { recordMove, returnMoves, displayMove };
  }();

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

})