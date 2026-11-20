import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/vazirmatn';
import '@fontsource-variable/inter';
import './style.css';
import App from './App';
import { loadState } from '@/lib/state';

void loadState();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
