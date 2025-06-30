import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../resources/style.css';
import '../../resources/notes.css';

const NotasDashboard = () => {
  const [notas, setNotas] = useState([]);
  const [filtro, setFiltro] = useState('minhas');

  useEffect(() => {
    axios.get('/api/notes')
        .then(res => setNotas(res.data || []))
        .catch(err => console.error("Erro ao buscar notas:", err));
    }, []);

const notasFiltradas = Array.isArray(notas) ? notas : [];


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">Notes4Web</span>
        </div>
        <input type="text" placeholder="Buscar" className="search-bar" />
        <div className="icons">
          <span className="icon engrenagem">⚙️</span>
          <span className="icon perfil">👤</span>
        </div>
      </header>

      <div className="filtros">
        <button
          className={`filtro-btn ${filtro === 'minhas' ? 'ativo' : ''}`}
          onClick={() => setFiltro('minhas')}
        >
          ✅ Minhas notas
        </button>
        <button
          className={`filtro-btn ${filtro === 'compartilhadas' ? 'ativo' : ''}`}
          onClick={() => setFiltro('compartilhadas')}
        >
          ⬜ Compartilhados comigo
        </button>
      </div>

      <div className="notas-grid">
        {notasFiltradas.map((nota, index) => {
            const linhas = nota.content.split('\n'); // divide conteúdo em linhas
            return (
                <div className="nota-cartao" key={nota.id || index}>
                <h3 className="nota-titulo">{nota.title}</h3>
                {linhas.slice(0, 3).map((linha, i) => (
                    <p key={i}>{linha}</p>
                ))}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default NotasDashboard;
