import React from 'react';
import '../App';
function About() {
  return (
    <>
      <div style={{ padding: '0.1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>About This App</h1>
        <p>Kiwi – Simple and Smart To-Do List App.</p>
        <p>This app was built using React and Airtable as a backend.</p>
        <p>
          You can add, complete, and edit your todos, and all changes are synced
          with your Airtable base.
        </p>
      </div>
      <footer className="footer">
        <p>© {new Date().getFullYear()} | Jose Mauricio Morales</p>
      </footer>
    </>
  );
}

export default About;
