import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register  from './pages/users/register';
import Login from './pages/users/login';
import ListPage from './pages/tasks/tasks';
import DetailPage from './pages/tasks/detail';
import CreatePage from './pages/tasks/create';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/user/register' element={<Register></Register>} />
        <Route path='/user/login' element={<Login></Login>} />
        <Route path='/' element={<ListPage></ListPage>}/>
        <Route path='/task/:id' element={<DetailPage/>}/>
        <Route path='/task/new' element={<CreatePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
