import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard';  
import Producers from './pages/producers';  
import Farms from './pages/farms';          

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main className="p-4 flex-grow-1" style={{ marginTop: '60px', marginLeft: '240px', maxWidth: 'calc(100vw - 240px)' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/producers" element={<Producers />} />
              <Route path="/farms" element={<Farms />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
