import './App.css'
import { Login } from './components/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import AdminLogin from './components/AdminLogin';
import Students from './components/AdminLandling';
import { Home } from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Login}></Route>
        <Route path='/home' Component={Home}></Route>
        <Route path='/admin' Component={AdminLogin}></Route>
        <Route path='/adminHome' Component={Students}></Route>
        <Route path='/signup' Component={Signup}></Route>
      </Routes>
    </Router>
  )
}

export default App
