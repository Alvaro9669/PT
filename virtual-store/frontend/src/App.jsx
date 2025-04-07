import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalMenu from './components/HorizontalMenu';
import Profile from './pages/Profile';
import Productos from './pages/productos';
import Carrito from './pages/carrito';


const App = () => {
    return (
        <Router>
            <HorizontalMenu /> {/* Agregar el menú horizontal */}
            <Routes>
            <Route path="/profile" element={<Profile />} /> {/* Ruta para el perfil */}
            <Route path="/" element={<Productos/>} />
            <Route path="/carrito" element={<Carrito/>} />
            </Routes>
        </Router>
    );
};

export default App;
/*        <Route path="/tickets" element={<Tickets/>} />
            <Route path="/carrito" element={<Carrito/>} />
            <Route path="/pago" element={<Pago/>} />
            */