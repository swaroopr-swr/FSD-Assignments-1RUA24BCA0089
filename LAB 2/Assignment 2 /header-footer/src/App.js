import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      
      {/* Main Content Area */}
      <main className="main-content">
        <h1>Financial infrastructure for the internet</h1>
        <p>
          Millions of companies of all sizes—from startups to Fortune 500s—use
          Stripe's software and APIs to accept payments, send payouts, and
          manage their businesses online.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default App;
