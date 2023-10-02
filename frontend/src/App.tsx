import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register  from './pages/users/register';
import Login from './pages/users/login';
import Tasks from './pages/tasks/tasks';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/user/register' element={<Register></Register>} />
        <Route path='/user/login' element={<Login></Login>} />
        <Route path='/' element={<Tasks></Tasks>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
