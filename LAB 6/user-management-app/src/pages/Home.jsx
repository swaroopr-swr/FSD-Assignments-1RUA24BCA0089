import React, { useState, useEffect } from 'react';
import { users } from '../data/users';
import Counter from '../components/Counter';
import Toggle from '../components/Toggle';
import UserForm from '../components/UserForm';
import Todo from '../components/Todo';
import UserSearch from '../components/UserSearch';

const Home = () => {
  // Step 9: useEffect Demonstration (Live Clock)
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // This runs once when component mounts
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup function: runs when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means it only runs on mount

  const evenUsersCount = users.filter(u => u.id % 2 === 0).length;
  const oddUsersCount = users.filter(u => u.id % 2 !== 0).length;

  return (
    <div className="page-container">
      <header className="home-header">
        <h1>User Management Dashboard</h1>
        <p>Assignment: React Components, State, and Routing</p>
        <div className="live-clock">Current Time: {time}</div>
      </header>
      
      <div className="stats-container">
        <div className="stat-card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h2>{evenUsersCount}</h2>
          <p>Even ID Users</p>
        </div>
        <div className="stat-card">
          <h2>{oddUsersCount}</h2>
          <p>Odd ID Users</p>
        </div>
      </div>

      <h2 className="section-title">React Lab Components (Step 8)</h2>
      <div className="lab-grid">
        <Counter />
        <Toggle />
        <Todo />
        <UserSearch />
        <UserForm />
      </div>
    </div>
  );
};

export default Home;
