import React, { useState } from 'react';
import './App.css';

// ---------------------------------------------------------------------------
// 5. TOAST MESSAGE COMPONENT
// Demonstrates component abstraction and conditional rendering based on props
// ---------------------------------------------------------------------------
function Toast({ message, isVisible }) {
  // Conditional rendering: If not visible, return null (renders nothing)
  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast-content">
        <span className="toast-icon">✓</span>
        <div className="toast-text">
          <h4>Application submitted successfully! 🎉</h4>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LEFT SIDE: BRAND / HERO SECTION
// A functional component for the left panel of our split-screen design
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="logo-container">
          <div className="logo-icon">✦</div>
          <h2>InternHub</h2>
        </div>
        
        <h1 className="hero-title">Launch Your Career</h1>
        
        <p className="hero-subtitle">
          Apply for internships, gain real-world experience, and take the next step toward your professional future.
        </p>
        
        <div className="abstract-visual">
          <div className="glass-card">
            <div className="glass-circle glass-circle-1"></div>
            <div className="glass-circle glass-circle-2"></div>
            <p className="tagline">"Start your journey. Build your future."</p>
          </div>
        </div>
        
        <p className="hero-footer">Your next opportunity could start here.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RIGHT SIDE: APPLICATION FORM
// Demonstrates forms, useState, event handling, and conditional rendering
// ---------------------------------------------------------------------------
function ApplicationForm() {
  // 1. useState Hook: Managing state for every form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState(null);
  const [terms, setTerms] = useState(false);

  // State for Toast functionality
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 6. CLEAR FORM BUTTON logic: Resets all state variables to default values
  const handleClearForm = (event) => {
    setName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setPosition('');
    setExperience('');
    setSkills('');
    setMessage('');
    setResume(null);
    setTerms(false);
    
    // Clear the physical file input value
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  // 2. EVENT HANDLING: Handling the form submit event
  const handleSubmit = (event) => {
    // 3. event.preventDefault(): Prevents the page from reloading
    event.preventDefault();

    // 4. ALERT: Client-side validation
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    if (!college.trim()) {
      alert("Please enter your college or university.");
      return;
    }
    if (!position) {
      alert("Please select an internship position.");
      return;
    }
    if (!experience) {
      alert("Please select your experience level.");
      return;
    }
    if (!message.trim()) {
      alert("Please tell us briefly about yourself and why you are interested in this internship.");
      return;
    }
    if (!terms) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    // If validation passes, log data and show the toast notification
    console.log("=== Form Submitted Successfully ===");
    console.log({
      name,
      email,
      phone,
      college,
      position,
      experience,
      skills,
      message,
      resume: resume ? resume.name : null,
      terms
    });
    
    setToastMessage("We'll review your application and contact you soon.");
    setShowToast(true);
    
    // Automatically hide the toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="form-section">
      {/* Toast component mounted here. It handles its own visibility based on the showToast state */}
      <Toast message={toastMessage} isVisible={showToast} />
      
      <div className="form-header">
        <h2>Apply for an Internship</h2>
        <p>Complete the form below to submit your application.</p>
      </div>

      {/* onSubmit event handler attached to the form */}
      <form onSubmit={handleSubmit} className="application-form">
        
        {/* Text Input */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            placeholder="Enter your full name" 
            value={name}
            onChange={(e) => setName(e.target.value)} // onChange event handler updating state
          />
        </div>

        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Input */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone"
            placeholder="Enter your phone number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label htmlFor="college">College / University</label>
          <input 
            type="text" 
            id="college"
            placeholder="Enter your college or university" 
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
        </div>

        {/* Select / Dropdown */}
        <div className="form-group">
          <label htmlFor="position">Internship Position</label>
          <select 
            id="position"
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select a position...</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Software Tester">Software Tester</option>
            <option value="Mobile App Developer">Mobile App Developer</option>
          </select>
        </div>

        {/* Radio Buttons */}
        <div className="form-group">
          <label>Experience Level</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="experience" 
                value="Beginner"
                checked={experience === "Beginner"}
                onChange={(e) => setExperience(e.target.value)}
              />
              Beginner
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="experience" 
                value="Intermediate"
                checked={experience === "Intermediate"}
                onChange={(e) => setExperience(e.target.value)}
              />
              Intermediate
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="experience" 
                value="Advanced"
                checked={experience === "Advanced"}
                onChange={(e) => setExperience(e.target.value)}
              />
              Advanced
            </label>
          </div>
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input 
            type="text" 
            id="skills"
            placeholder="e.g. React, Java, Python, Figma" 
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        {/* Textarea */}
        <div className="form-group">
          <label htmlFor="message">Why should we select you?</label>
          <textarea 
            id="message"
            placeholder="Tell us briefly about yourself and why you are interested in this internship..." 
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label htmlFor="resume-upload">Resume</label>
          <input 
            type="file" 
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>

        {/* Checkbox */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            I agree to the Terms &amp; Conditions and confirm that the information provided is accurate.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          {/* type="submit" triggers the form's onSubmit event */}
          <button type="submit" className="btn-primary">Apply Now</button>
          
          {/* type="button" prevents it from submitting the form, onClick handles the clear logic */}
          <button type="button" className="btn-secondary" onClick={handleClearForm}>Clear Form</button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// Combines the Hero section and Application form to create the split layout
// ---------------------------------------------------------------------------
function App() {
  return (
    <div className="app-container">
      <HeroSection />
      <ApplicationForm />
    </div>
  );
}

export default App;
