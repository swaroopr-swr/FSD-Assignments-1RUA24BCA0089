import React from 'react';

function Header({ profile }) {
  return (
    <header className="hero-section animate-fade-in">
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-subtitle">BCA STUDENT / RV UNIVERSITY</span>
          <h1 className="hero-name">{profile.name}.</h1>
          <p className="hero-bio">
            A third-year BCA student who builds web and mobile applications while exploring programming, data, and AI.
          </p>
          <div className="hero-buttons">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-primary">
              LinkedIn profile ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary">
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="hero-card-wrapper">
          <div className="hero-glass-card">
            <div className="profile-photo-container">
              {/* Note: Make sure to save your photo as profile.jpeg in the public folder! */}
              <img src="/profile.jpeg" alt={profile.name} className="profile-photo" />
            </div>
            
            <div className="status-section">
              <span className="status-label">CURRENTLY</span>
              <div className="status-indicator">
                <span className="dot"></span>
                <span>Learning & building</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">02</span>
                <span className="stat-text">verified certificates</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">3rd year</span>
                <span className="stat-text">BCA at RVU</span>
              </div>
            </div>
            
            <div className="location-text">
              📍 Bengaluru, Karnataka, India
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;