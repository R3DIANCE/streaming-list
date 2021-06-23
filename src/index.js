import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
require('intersection-observer');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);