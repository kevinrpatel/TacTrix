import React, { useState } from 'react';
import '../assets/styles/GameBoard.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { FiShare } from "react-icons/fi";

export default function GameBoard() {
  const symbol = localStorage.getItem("symbol") || "x";
  const game_type = localStorage.getItem("game_type");
  const computersymbol = symbol === "x" ? "o" : "x";
  const roomcode=localStorage.getItem('room_code');
  const [board, SetBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(symbol);
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0); 

  const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const checkWinner = (currentBoard) => {
    for (let pattern of winpatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[b] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] !== null || turn !== symbol || winner) return;

    const NewBoard = [...board];
    NewBoard[index] = symbol;
    SetBoard(NewBoard);
    setMoves(moves + 1); // Increment moves

    const gameWinner = checkWinner(NewBoard);
    if (gameWinner) { 
      setWinner(gameWinner);
      savegamehistory(gameWinner, moves + 1); // Save game history on win
      return;
    }

    if (!NewBoard.includes(null)) {
      setWinner(null); // It's a draw
      savegamehistory(null, moves + 1); // Save game history on draw
      return;
    }

    setTurn(computersymbol);
    setTimeout(() => computermoves(NewBoard), 500);
  };

  const computermoves = (currentBoard) => {
    if (winner) return;
    const bestMove = findBestMove(currentBoard);
    if (bestMove === -1) return;

    const newBoard = [...currentBoard];
    newBoard[bestMove] = computersymbol;
    SetBoard(newBoard);
    setMoves(moves + 1); // Increment moves

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      savegamehistory(gameWinner, moves + 1); // Save game history on win
      return;
    }

    if (!newBoard.includes(null)) {
      setWinner(null); // It's a draw
      savegamehistory(null, moves + 1); // Save game history on draw
      return;
    }

    // setTimeout(() => {
    setTurn(symbol);
  // }, 800);
  };

  const findBestMove = (currentBoard) => {
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = computersymbol;
        if (checkWinner(testBoard) === computersymbol) return i;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = symbol;
        if (checkWinner(testBoard) === symbol) return i;
      }
    }

    const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (let i of preferredMoves) {
      if (currentBoard[i] === null) return i;
    }

    return -1;
  };

  const resetGame = () => {
    SetBoard(Array(9).fill(null));
    setTurn(symbol);
    setWinner(null);
    setMoves(0); // Reset moves
  };

  const exit = () => {
    localStorage.clear();
    window.location.href = '/Login';
  };

 

  const savegamehistory = async (winnerSymbol, totalMoves) => {
  const player1_id = sessionStorage.getItem("id");
  const player2_id = null;
  let winner_id = null;
  let winner_type = null;

  if (winnerSymbol === null) {
    // Draw
    winner_type = "draw";
  } else if (winnerSymbol === symbol) {
    // Player wins
    winner_id = player1_id;
    winner_type = "player";
  } else {
    // Computer wins
    winner_type = "computer";
  }

  const game_result = winner_type === "draw" ? "draw" : "win";

  const formData = new FormData();

  formData.append('player1_id', player1_id);
  formData.append('player2_id', player2_id);
  formData.append('game_type', game_type);
  formData.append('player1_symbol', symbol);
  formData.append('player2_symbol', computersymbol);
  formData.append('game_result', game_result);
  formData.append('winner_id', winner_id);
  formData.append('winner_type', winner_type);  // <-- Add winner_type here
  formData.append('total_moves', totalMoves);

  try {
    const res = await axios.post('http://localhost:8080/tic-tac-toe/game_history.php', formData);

    if (res.data.status === true) {
      console.log("Game history saved successfully:", res.data.message);
    } else {
      console.error("Failed to save:", res.data.message || res.data.error);
    }
  } catch (error) {
    console.error("Error while saving game history:", error);
  }
};

const handleShare = () => {
  const shareLink = `${window.location.protocol}//${window.location.host}/Login?room=${roomcode}`;
  const shareText = `Join my Tic Tac Toe room!\nRoom Code: ${roomcode}\n${shareLink}`;

  if (navigator.share) {
    navigator.share({
      title: 'Join Tic Tac Toe Game',
      text: `Room Code: ${roomcode}`,
      url: shareLink
    }).catch((err) => console.error("Sharing failed:", err));
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Share link copied to clipboard!\nPaste it in WhatsApp or Email.");
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  }
};



  return (
    <div className='min-vh-100 d-flex flex-column justify-content-start align-items-center' style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
   {game_type==="friends" &&(
    <Button className='share-button text-white' variant='link' onClick={handleShare} style={{border:"1px solid #fff",textDecoration:"none",borderRadius:"1rem"}}>
       <FiShare />&nbsp;Share
    </Button>)}

    {game_type==="friends" &&(
      <h5 className="fw-bold mt-4" style={{ color: '#FFEE58', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
      Room No : <span style={{ color: '#FFC107' }}>{roomcode}</span>
    </h5>)}

      <h1 className='text-white mt-4'>TacTrix </h1>

      {winner ? (
        <h2 className='text-warning mt-4'>
          🎉 Congratulations, Winner is <span style={{ color: winner === symbol ? '#FF4081' : '#2979FF' }}>{winner === symbol ? "You" : "Computer"}</span>!
        </h2>
      ) : (!board.includes(null) ? (
        <h2 className='text-light mt-4'>
          🤝 It's a Draw!
        </h2>
      ) : null)}


      {!winner && (
        <div className='game mt-3'>
          {
            board.map((value, index) => (
              <div className='box' key={index} onClick={() => handleClick(index)}>
                <p style={{ color: value === symbol ? '#FF4081' : value === computersymbol ? '#00C853' : 'white' }}>{value}</p>
              </div>
            ))
          }
        </div>
      )}

      {!winner && (
        <div className='d-flex flex-row mt-3 fs-5' style={{ columnGap: '100px' }}>
          <span style={{ color: '#00e5ff', fontWeight: "bold", textTransform: "uppercase" ,animation: (turn === symbol && moves > 0) ? "blink 1s infinite" : "none"}}>You ({symbol})</span>
          <span style={{ color: '#ffc107', fontWeight: "bold", textTransform: "uppercase" ,  animation: (turn === computersymbol && moves > 0) ? "blink 1s infinite" : "none"}}>Computer ({computersymbol})</span>
        </div>
      )}

      <div className='d-flex justify-content-center align-items-center mt-4 mb-4' style={{ columnGap: '20px' }}>
        <Button variant='success' onClick={resetGame}>{winner  ? "Play Again" : "Reset Game"}</Button>
        <Button variant='danger'  onClick={exit}>Exit</Button>
        
      </div>
    </div>
  );
}