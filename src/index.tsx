import React from 'react';
import App from './App';
import './index.css';

// Simple React DOM render function
const render = () => {
  const container = document.getElementById('root');
  if (container) {
    // Use React 18 createRoot if available, fallback to React 17 render
    if ('createRoot' in React) {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(container);
      root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(App)
        )
      );
    } else {
      const ReactDOM = require('react-dom');
      ReactDOM.render(
        React.createElement(React.StrictMode, null,
          React.createElement(App)
        ),
        container
      );
    }
  }
};

render();
