import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalMenu from './components/HorizontalMenu';
import Profile from './pages/Profile';
import Productos from './pages/productos';
import Carrito from './pages/carrito';
import './styles/App.css';

// Componente principal de la aplicación
const App = () => {
    // Estado para controlar la intensidad del efecto blur basado en scroll
    const [blurAmount, setBlurAmount] = useState(0);

    // Función para manejar el scroll y calcular el efecto blur
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        // Calcular intensidad del blur entre 0 y 10px basado en la posición del scroll
        let amount = Math.min((scrollTop - 50) / 4, 10); // Fórmula: (scrollTop-50)/4 = máximo 10px
        amount = Math.max(amount, 0); // No permitir valores negativos
        setBlurAmount(amount);
    };

    return (
        <Router>
            <div className="App">
                {/* Menú horizontal con efecto blur dinámico */}
                <HorizontalMenu blurAmount={blurAmount} />
                {/* Contenido principal con detector de scroll */}
                <main className="main-content" onScroll={handleScroll}>
                    <Routes>
                        {/* Rutas de la aplicación */}
                        <Route path="/profile" element={<Profile />} />    {/* Página de perfil de usuario */}
                        <Route path="/" element={<Productos/>} />          {/* Página principal con productos */}
                        <Route path="/carrito" element={<Carrito/>} />     {/* Página del carrito de compras */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
// Nota: Ruta de tickets comentada - pendiente de implementación
// <Route path="/tickets" element={<Tickets/>} />