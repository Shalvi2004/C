import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Community from './components/Community';
import CreateToken from './components/CreateToken';
// import Private from './components/Private';
import Chat from './components/Chat';
import TechTalk from './components/TechTalk';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
  
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route path="/main" element={<Community />} /> 
        <Route path="/CreateToken" element={<CreateToken />} /> 
        <Route path="/community/general-chat" element={<Chat />} /> 
        <Route path="/community/tech-talk" element={<TechTalk />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>

  );
};

export default App;