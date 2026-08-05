import React from 'react';

function Education({ education }) {
  return (
    <section className="resume-section animate-fade-in delay-300">
      <h3>Education</h3>
      <div className="timeline">
        {education.map((edu) => (
          <div key={edu.id} className="timeline-item">
            <h4>{edu.degree}</h4>
            <span className="company">{edu.institution}</span>
            <span className="duration">{edu.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Education;