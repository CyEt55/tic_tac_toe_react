import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }){
  return (
    <button className={"square " + (isWinning ? "square--winner" : null)} onClick={onSquareClick}>{ value }</button>
  );
}

function Board({ xIsNext, squares, onPlay, updateCoordinates, numMoves }) {

  const location = [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2],[1,3],[2,3],[3,3]];
  let coor = [];

  function handleClick(i){
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
    coor = location[i];
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: " + winner.player;
  }else{
    status = numMoves.length === 10 ? "Draw" : "Next player: " + (xIsNext ? "X" : "O");
  }

  let rows = [0,1,2];
  let cells = [0,1,2];

  return (
    <>
      <div className="status">{ status }</div>
      {rows.map((row, ind) => (
        <div className="board-row">
          {cells.map((cell, id) => (
            <Square isWinning={winner ? winner.line.includes(ind * 3 + id) : false} value={squares[ind * 3 + id]} onSquareClick={() => {handleClick(ind * 3 + id); updateCoordinates(coor)}}/>
          ))}
        </div>
      ))};
    </>
  );
}

export default function Game(){
 
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [coordinates, setCoordinates] = useState([Array(2).fill(null)]);   
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isDescending, setIsDescending] = useState(true);

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const updateCoordinates = (coor) => {
    const nextCoor = [...coordinates.slice(0, currentMove + 1), coor];
    setCoordinates(nextCoor); 
  }

  function orderHistory(){
      setIsDescending(!isDescending);
  }

  const moves = history.map((step, move) => {

    let description;

    if(move > 0){
      description = 'Go to move #' + move + " | " + coordinates[move];
    }else{
      description = 'Go to game start';
    }

  
    if(currentMove === move){
      return (
        <li key={move}>
            { description }
        </li>
      );
    }else{
      return (
      <li key={move}>
          <button onClick={() => jumpTo(move)}>{ description }</button>
      </li>
      );
    }
    
  });

  return(
    <div className="game">
      <div className="game-board">
        <Board numMoves={moves} updateCoordinates={updateCoordinates} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      
      <div className="game-info">
        <button onClick={() => orderHistory()}>Sort by: {isDescending ? "Descending":"Ascending"}</button>
        <ol>{ isDescending ? moves : moves.reverse() }</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  for(let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {player: squares[a], line: lines[i]};
    }
  }
  return null;
}