import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/App.css';

// Punto de entrada principal de la aplicación React
// Renderiza el componente App en el elemento con id 'root' del HTML
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);