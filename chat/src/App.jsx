import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Community from './components/Community';
import CreateToken from './components/CreateToken';
// import Private from './components/Private'; // Unused component, check if it's needed
import Chat from './components/Chat';
import TechTalk from './components/TechTalk';
import GeneratedToken from './components/GeneratedToken';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/main" element={<Community />} /> 
        <Route path="/create-token" element={<CreateToken />} /> 
       
        <Route path="/community/general-chat" element={<Chat />} /> 
        <Route path="/community/tech-talk" element={<TechTalk />} />  
        <Route path="/GeneratedToken" element={<GeneratedToken />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>

  );
};

export default App;