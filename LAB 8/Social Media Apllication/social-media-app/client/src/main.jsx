import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import styles in the specified order
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/tokens.css';
import './styles/bootstrap-overrides.css';
import './styles/base.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
