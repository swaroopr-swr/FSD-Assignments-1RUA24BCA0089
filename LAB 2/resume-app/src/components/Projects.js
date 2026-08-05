import React from 'react';

function Projects({ projects }) {
  return (
    <section className="resume-section animate-fade-in delay-200">
      <h3>Projects</h3>
      <div className="timeline">
        {projects.map((project) => (
          <div key={project.id} className="timeline-item">
            <h4>{project.title}</h4>
            {project.tagline && <span className="tagline">{project.tagline}</span>}
            <p>{project.description}</p>
            <div className="skills-grid" style={{ marginTop: '15px' }}>
              {project.techStack.map((tech, index) => (
                <span key={index} className="skill-badge" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                  {tech}
                </span>
              ))}
            </div>
            {project.links && project.links.length > 0 && (
              <div className="project-links">
                {project.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;