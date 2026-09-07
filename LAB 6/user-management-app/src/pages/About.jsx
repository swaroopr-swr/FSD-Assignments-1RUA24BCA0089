import React from 'react';

const About = () => {
  return (
    <div className="page-container about-page">
      <h2>About This Project</h2>
      
      <section className="about-section">
        <h3>Project Objective</h3>
        <p>This application was built as a complete React assignment demonstrating a strong understanding of fundamental React concepts, including component architecture, state management, routing, and API integration.</p>
      </section>

      <section className="about-section">
        <h3>Technologies Used</h3>
        <ul>
          <li><strong>React (Create React App):</strong> Frontend framework</li>
          <li><strong>React Router DOM:</strong> For navigation without page reloads</li>
          <li><strong>CSS3:</strong> Custom styling and responsive grids (No Tailwind)</li>
        </ul>
      </section>

      <section className="about-section">
        <h3>React Concepts Demonstrated</h3>
        <ul>
          <li><strong>Functional Components:</strong> Modular and reusable UI blocks (like <code>UserCard</code>).</li>
          <li><strong>useState Hook:</strong> Managing local state (Counter, Toggle, Form inputs, Todo list).</li>
          <li><strong>useEffect Hook:</strong> Handling side effects like API fetching and real-time clock intervals.</li>
          <li><strong>Props:</strong> Passing data from parent pages down to child components.</li>
          <li><strong>Conditional Rendering:</strong> Showing/hiding elements based on state variables.</li>
          <li><strong>Controlled Components:</strong> Managing form data natively inside React state.</li>
        </ul>
      </section>

      <section className="about-section">
        <h3>Routing & Data Filtering</h3>
        <p>The app uses React Router to provide distinct URLs for different views. We implemented special routes (<code>/users/even</code> and <code>/users/odd</code>) that demonstrate array filtering. The <code>EvenUsers</code> page applies the logic <code>user.id % 2 === 0</code> to extract even IDs, while <code>OddUsers</code> applies <code>user.id % 2 !== 0</code>.</p>
      </section>
    </div>
  );
};

export default About;
