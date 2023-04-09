import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const Square = (props) => {
  return (
    <button
    className={props.isHighlight ? `square highlight-color` : `square`}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
};

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        isHighlight={ props.winLine.includes(i) }
        key={i}
      />
    );
  };

  return (
    <div>
      {Array(3)
        .fill(0)
        .map((row, i) => {
          return (
            <div className="board-row" key={i}>
              {Array(3)
                .fill(0)
                .map((col, j) => {
                  return renderSquare(i * 3 + j);
                })}
            </div>
          );
        })}
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [isAsc, setAsc] = useState(true);

  // ボタンが押されたとき
  const handleClick = (i) => {
    const _history = history.slice(0, stepNumber + 1);
    const _current = _history[_history.length - 1];
    const _squares = _current.squares.slice();

    if (calculateWinner(_squares) || _squares[i]) {
      return;
    }
    _squares[i] = xIsNext ? "X" : "O";
    setHistory(
      _history.concat([
        {
          squares: _squares,
          col: i % 3,
          row: Math.floor(i / 3),
        },
      ])
    );
    setStepNumber(_history.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const toggleAsc = () => {
    setAsc(!isAsc);
  };

  const historyCopy = history;
  //最新の状態
  const current = historyCopy[stepNumber];

  const winner = calculateWinner(current.squares);

  let status;
  let winLine = [];
  if (winner === "Draw") {
    status = winner;
  } else if (winner) {
    winLine = winner.line;
    status = `Winner: ${winner.player}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  //move: 現在の要素のインデックス
  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move # ${move} (col,row)=(${step.col},${step.row})`
      : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move === stepNumber ? <strong>{desc}</strong> : desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* ボタンが押されたらhandleClick(i)を実行 */}
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winLine={winLine}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => toggleAsc()}>ASC⇄DESC</button>
        <ol>{isAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    //勝者がいた場合
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
      //squares[a]= 'X' or 'O'
    }
  }

  //引き分け＝全てのマスが埋まった →nullが含まれない
  if (!squares.includes(null)) {
    return "Draw";
  }
  //勝者出てない、決着ついてない場合
  return null;
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
