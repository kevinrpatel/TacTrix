import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function RoomAccess() {
  const nav = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect socket once on component mount
    socketRef.current = io('http://localhost:3000'); // Your socket.io server URL

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server with id:', socketRef.current.id);
    });

    // Optional: listen for server responses if needed
    socketRef.current.on('room_created', (data) => {
      console.log('Room created:', data);
      // You can navigate or update UI based on server response
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleCreate = async () => {
    const player1_id = sessionStorage.getItem('id');
    const player1_symbol = localStorage.getItem('symbol');
    const player2_symbol = player1_symbol === 'x' ? 'o' : 'x';
    const game_status = 'waiting';

    const formdata = new FormData();
    formdata.append('player1_id', player1_id);
    formdata.append('player1_symbol', player1_symbol);
    formdata.append('player2_symbol', player2_symbol);
    formdata.append('game_status', game_status);

    try {
      const res = await axios.post('http://localhost:8080/tic-tac-toe/create_room.php', formdata);

      if (res.data.status === true) {
        alert('Room is successfully created.');
        
        // Emit event to server via socket to join/create room
       const roomcode = res.data.room_code;  // Assuming your backend sends back room id
        socketRef.current.emit('create_room', { roomcode, player1_id });
       localStorage.setItem('room_code',roomcode);
         nav('/GameBoard');
      } else {
        alert('Room creation failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Error while creating the room.');
    }
  };

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
    >
      <div className="bg-white p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center text-primary mb-4 fw-bold">Multiplayer Room</h4>

        {/* Create Room Section */}
        <div style={{ border: '1px solid #aaa', borderRadius: '10px' }} className="mb-4 p-3">
          <h6 className="fw-semibold mb-2 text-success">Create a Room</h6>
          <Button variant="danger" className="w-100 mb-2" onClick={handleCreate}>
            Create Room
          </Button>
        </div>
        
        {/* <div style={{ border: '1px solid #aaa', borderRadius: '10px' }} className="mb-4 p-3">
          <h6 className="fw-semibold mb-2 text-success"> Join Room</h6>
          <input type="text" className="form-control mb-2" style={{ border: '1px solid #aaa' }} placeholder="Enter room code"/>
          <Button variant="success" className="w-100 mb-2">
            Join Room
          </Button>
        </div> */}
      </div>
    </div>
  );
}
