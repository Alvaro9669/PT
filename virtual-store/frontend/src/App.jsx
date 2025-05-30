import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalMenu from './components/HorizontalMenu';
import Profile from './pages/Profile';
import Productos from './pages/productos';
import Carrito from './pages/carrito';
import './styles/App.css';

const App = () => {
    const [blurAmount, setBlurAmount] = useState(0);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        // Calculamos la intensidad entre 0 y 10px de blur
        let amount = Math.min((scrollTop - 50) / 4, 10); // (50-10)/4 = 10
        amount = Math.max(amount, 0); // No permitir valores negativos
        setBlurAmount(amount);
    };

    return (
        <Router>
            <div className="App">
                <HorizontalMenu blurAmount={blurAmount} />
                <main className="main-content" onScroll={handleScroll}>
                    <Routes>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Productos/>} />
                        <Route path="/carrito" element={<Carrito/>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
/*        <Route path="/tickets" element={<Tickets/>} />
            */