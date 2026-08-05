import React from 'react';

function Skills({ skills }) {
  return (
    <section className="resume-section animate-fade-in delay-200">
      <h3>Skills</h3>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <span key={index} className="skill-badge">{skill}</span>
        ))}
      </div>
    </section>
  );
}

export default Skills;