import React from 'react';

function About({ bio }) {
  return (
    <section className="resume-section animate-fade-in delay-100">
      <h3>About Me</h3>
      <p>{bio}</p>
    </section>
  );
}

export default About;