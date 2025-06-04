import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SelectionMenu() {
  const[selectedsymbol,SetSelectedSymbol]=useState(null);
  const nav=useNavigate();
  const username = sessionStorage.getItem('name') || "player1";

  const handleslect=(symbol)=>{
    SetSelectedSymbol(symbol);
  }

  const handleGamePlay=(game_type)=>{
    if(!selectedsymbol){
      alert('select symbol first ')
    }else{
   
      localStorage.setItem('symbol',selectedsymbol);
      localStorage.setItem('game_type',game_type)
      if (game_type === "computer") {
        nav('/GameBoard'); 
      } else if (game_type === "friends") {
        nav('/RoomAccess');
      }
    }
      
  }
  return (
    <div
    className="d-flex justify-content-center align-items-center min-vh-100"
    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
  >
    <div className="d-flex flex-column align-items-center gap-4 rounded shadow bg-white p-5" style={{ minWidth: '350px' }}>
      <div className="fs-3 fw-bold text-primary">
        Welcome, <span style={{ color: '#00e5ff' }}>{username}!</span>
      </div>
      
      <div className="fs-4 fw-semibold text-dark">Choose your symbol</div>
      
      <div className="d-flex gap-4">
        <Button
          className={`shadow border-0 ${selectedsymbol === 'x' ? 'bg-primary text-white' : 'bg-light text-primary'}`}
          style={{ fontSize: '3rem', padding: '0.75rem 1.5rem', fontFamily: 'monospace' }}
          onClick={() => handleslect('x')}
        >
          X
        </Button>
        <Button
          className={`shadow border-0 ${selectedsymbol === '0' ? 'bg-primary text-white' : 'bg-light text-primary'}`}
          style={{ fontSize: '3rem', padding: '0.75rem 1.5rem', fontFamily: 'monospace' }}
          onClick={() => handleslect('0')}
        >
        O
        </Button>
      </div>
  
      <div className="text-secondary" style={{ fontSize: "18px" }}>
        Your selection is:&nbsp;<span style={{ color: "#FFC107" }}>{selectedsymbol || 'None'}</span>
      </div>

    
      <Button variant='success' className="w-100" onClick={()=>handleGamePlay("computer")}>Play with robot</Button>
      <Button variant='danger' className="w-100" onClick={()=>handleGamePlay("friends") }>Play with friend</Button>
 

      
    </div>
  </div>
  
  );
}
