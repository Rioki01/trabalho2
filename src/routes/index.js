import { Routes, Route } from 'react-router-dom'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Alunos from '../pages/Alunos'
import New from '../pages/New'

import Private from './Private'

function RoutesApp(){
  return(
    <Routes>
      <Route path="/" element={ <SignIn/> } />
      <Route path="/register" element={ <SignUp/> } />

      <Route path="/dashboard" element={ <Private><Dashboard/></Private> } />
      
      <Route path="/profile" element={ <Private><Profile/></Private> } />

      <Route path="/Alunos" element={<Private><Alunos/></Private>} />
      
      <Route path="/new" element={<Private><New/></Private>} />

      <Route path="/new/:id" element={<Private><New/></Private>} />
    </Routes>
  )
}

export default RoutesApp;