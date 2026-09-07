import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllUsers from './pages/AllUsers';
import EvenUsers from './pages/EvenUsers';
import OddUsers from './pages/OddUsers';
import ApiUsers from './pages/ApiUsers';
import About from './pages/About';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/users/even" element={<EvenUsers />} />
          <Route path="/users/odd" element={<OddUsers />} />
          <Route path="/api-users" element={<ApiUsers />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
