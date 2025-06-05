import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function RoomAccess() {
  const nav = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('WebSocket error:', err);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleCreate = async () => {
    const player1_id = sessionStorage.getItem('id');
    const player1_symbol = localStorage.getItem('symbol') || 'x';
    const player2_symbol = player1_symbol === 'x' ? 'o' : 'x';
    const game_status = 'waiting';

    const formdata = new FormData();
    formdata.append('player1_id', player1_id);
    formdata.append('player1_symbol', player1_symbol);
    formdata.append('player2_symbol', player2_symbol);
    formdata.append('game_status', game_status);

    try {
      const res = await axios.post('http://tac-trix.wuaze.com/apis/create_room.php', formdata);

      if (res.data.status === true) {
        const roomcode = res.data.room_code;
        alert('Room created successfully');
        socketRef.current.emit('create_room', { roomcode, player1_id });
        localStorage.setItem('room_code', roomcode);
        nav('/GameBoard');
      } else {
        alert('Room creation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating room.');
    }
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center"
         style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      <div className="bg-white p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center text-primary mb-4 fw-bold">Multiplayer Room</h4>
        <div style={{ border: '1px solid #aaa', borderRadius: '10px' }} className="mb-4 p-3">
          <h6 className="fw-semibold mb-2 text-success">Create a Room</h6>
          <Button variant="danger" className="w-100 mb-2" onClick={handleCreate}>
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}
