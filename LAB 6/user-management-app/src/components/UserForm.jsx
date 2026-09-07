import React, { useState } from 'react';

const UserForm = () => {
  // State for form inputs (Controlled Component)
  const [formData, setFormData] = useState({ name: '', email: '', city: '' });
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Update specific field in state based on input name
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.city) {
      setError('All fields are required!');
      return;
    }
    
    setError('');
    setSubmittedData(formData); // Save to show below the form
    setFormData({ name: '', email: '', city: '' }); // Reset form
  };

  return (
    <div className="lab-component">
      <h3>User Form Component</h3>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-field">
          <label>01 — Name</label>
          <input 
            type="text" name="name" placeholder="Enter your full name" 
            value={formData.name} onChange={handleChange} 
          />
        </div>
        <div className="form-field">
          <label>02 — Email</label>
          <input 
            type="email" name="email" placeholder="Enter your email address" 
            value={formData.email} onChange={handleChange} 
          />
        </div>
        <div className="form-field">
          <label>03 — City</label>
          <input 
            type="text" name="city" placeholder="Enter your city" 
            value={formData.city} onChange={handleChange} 
          />
        </div>
        <div className="actions-divider">
          <button type="submit" className="btn-primary">Submit Form</button>
        </div>
      </form>
      
      {error && <p className="error-text">{error}</p>}
      
      {submittedData && (
        <div className="submitted-data">
          <h4>Submitted Successfully:</h4>
          <p>Name: {submittedData.name}</p>
          <p>Email: {submittedData.email}</p>
          <p>City: {submittedData.city}</p>
        </div>
      )}
    </div>
  );
};

export default UserForm;
