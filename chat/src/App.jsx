import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome'
import Community from './components/Community'
import CreateToken from './components/CreateToken';
import Private from './components/Private';
import Chat from './components/Chat';
import TechTalk from './components/TechTalk';

const App = () => {
  return (
    <>
    {/* <Private/> */}
    <Routes>
      <Route path="/" element={<Welcome/>}/>
      <Route path="/Main" element={<Community />} />
      <Route path="/Private" element={<CreateToken />} />
      <Route path="/community/General-chat" element={<Chat/>}/>
      <Route path = "/community/tech-talk" element={<TechTalk/>}/>

    </Routes>
   
    </>
  )
}

export default App