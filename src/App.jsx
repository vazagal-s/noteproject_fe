import React from 'react'; // 👈 Adicione isso
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; // Importa o componente de rota privada
import Home from "./components/Home"; // Importa o componente Home
import NotesDashboard from './components/Dashboard/NotesDashboard';
import NotesScreen from './components/Dashboard/NotesScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Home) */}
        <Route path="/" element={<Home />} />
        
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas Protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rotas Protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/notasdashboard" element={<NotesDashboard />} />
        </Route>
        
        <Route path="/notes" element={<NotesScreen />} />
        {/* Rota de fallback (opcional: página 404) */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;