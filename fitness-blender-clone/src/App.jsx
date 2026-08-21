import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'

import Home from './pages/Home'
import Videos from './pages/Videos'
import Programs from './pages/Programs'
import HealthyLiving from './pages/HealthyLiving'
import Community from './pages/Community'
import Store from './pages/Store'
import About from './pages/About'
import Membership from './pages/Membership'
import Cart from './pages/Cart'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
        <Header />
        <MobileNav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/programs-challenges" element={<Programs />} />
            <Route path="/healthy-living" element={<HealthyLiving />} />
            <Route path="/community" element={<Community />} />
            <Route path="/store" element={<Store />} />
            <Route path="/page/about-fitness-blender" element={<About />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/store/cart" element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
