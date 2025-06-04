import { Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import SelectionMenu from './components/SelectionMenu'
import GameBoard from './components/GameBoard'
import RoomAccess from './components/RoomAccess'



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/selectionMenu" element={<SelectionMenu />} />
      <Route path="/gameBoard" element={<GameBoard />} />
      <Route path="/roomAccess" element={<RoomAccess />} />
    


    </Routes>
  )
}

export default App
