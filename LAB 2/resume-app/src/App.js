import React from 'react';
import './App.css';
import { resumeData } from './resumeData';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import ContactModal from './components/ContactModal';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="App">
      <button className="floating-contact-btn" onClick={() => setIsModalOpen(true)}>
        Contact me ↗
      </button>
      
      <div className="resume-container">
        <Header profile={resumeData.profile} />
        <About bio={resumeData.profile.bio} />
        <Skills skills={resumeData.skills} />
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Experience experience={resumeData.experience} />
        )}
        <Projects projects={resumeData.projects} />
        <Education education={resumeData.education} />
        <Certificates certificates={resumeData.certificates} />
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        phone="8747809389"
        email={resumeData.profile.email}
      />
    </div>
  );
}

export default App;