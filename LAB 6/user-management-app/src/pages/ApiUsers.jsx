import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import { fetchApiUsers } from '../services/api';

const ApiUsers = () => {
  const [apiUsers, setApiUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchApiUsers();
        setApiUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from API. Please try again later.');
      } finally {
        setLoading(false); // Stop loading regardless of success/fail
      }
    };

    loadData();
  }, []);

  return (
    <div className="page-container">
      <h2>API Users (JSONPlaceholder)</h2>
      
      {loading && <div className="loading">Loading data...</div>}
      
      {error && <div className="error-alert">{error}</div>}
      
      {!loading && !error && (
        <div className="users-grid">
          {apiUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiUsers;
