import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="App">
      {/* Navigation Menu */}
      <header className="header">
        <div className="logo">
          <h2>Portfolio.</h2>
        </div>
        <nav>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <h1>Hi, I'm Alex.</h1>
        <p>I design and build beautiful responsive web experiences.</p>
        <a href="#projects"><button className="btn">View My Work</button></a>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <h2>Selected Projects</h2>
        <div className="projects-grid">
          <article className="project-card">
            <img src="/project_one.jpg" alt="Analytics Dashboard" className="project-image" />
            <div className="project-content">
              <h3>Analytics Dashboard</h3>
              <p>A sleek dark-mode web application for data visualization.</p>
            </div>
          </article>
          
          <article className="project-card">
            <img src="/project_two.jpg" alt="E-commerce App" className="project-image" />
            <div className="project-content">
              <h3>E-commerce App</h3>
              <p>A minimalist mobile shopping experience with modern typography.</p>
            </div>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ textAlign: 'center' }}>
        <h2>Get In Touch</h2>
        <p style={{ marginBottom: '2rem', color: '#aaa' }}>Have a project in mind? Let's talk.</p>
        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="form-control" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                className="form-control" 
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
