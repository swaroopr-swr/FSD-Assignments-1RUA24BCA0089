import React from 'react';

function Experience({ experience }) {
  return (
    <section className="resume-section">
      <h3>Experience</h3>
      <div className="timeline">
        {experience.map((job) => (
          <div key={job.id} className="timeline-item">
            <h4>{job.title} <span className="company">@ {job.company}</span></h4>
            <span className="duration">{job.duration}</span>
            <p>{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;