import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Declare tauri global type
declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
