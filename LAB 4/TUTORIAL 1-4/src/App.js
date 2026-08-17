import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import SelectCategory from './pages/SelectCategory';
import Home from './pages/Home';
import Browse from './pages/Browse';

function App() {
  return (
    <>
      <div className="aurora-bg"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-category" element={<SelectCategory />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
