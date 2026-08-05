import React from 'react';

function Certificates({ certificates }) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section className="resume-section animate-fade-in delay-400">
      <h3>Certificates</h3>
      <div className="timeline">
        {certificates.map((cert) => (
          <div key={cert.id} className="timeline-item">
            <h4>{cert.title}</h4>
            <span className="company">{cert.issuer}</span>
            <span className="duration">{cert.date}</span>
            {cert.link && cert.link !== "#" && (
              <a href={cert.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Certificates;