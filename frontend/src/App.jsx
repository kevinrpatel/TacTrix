import { Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/Signup'
import SelectionMenu from './components/SelectionMenu'
import GameBoard from './components/GameBoard'
import RoomAccess from './components/RoomAccess'



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/SelectionMenu" element={<SelectionMenu />} />
      <Route path="/GameBoard" element={<GameBoard />} />
      <Route path="/RoomAccess" element={<RoomAccess />} />
    


    </Routes>
  )
}

export default App
