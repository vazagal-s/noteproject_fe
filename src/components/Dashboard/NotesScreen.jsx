import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../../resources/style.css';
import '../../resources/notes_screen.css';
import React from 'react';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteType, setNoteType] = useState('minhas');
  const [isAdmin, setIsAdmin] = useState(true); // Novo estado para admin

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verifica se o usuário é admin
        const userResponse = await api.get('/auth/me');
        setIsAdmin(userResponse.data.isAdmin || false);
        
        // Busca as notas
        const endpoint = noteType === 'minhas' ? '/notes' : '/notes/shared';
        const notesResponse = await api.get(endpoint);
        setNotes(notesResponse.data);
        setFilteredNotes(notesResponse.data);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error('Erro:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [noteType]);

  useEffect(() => {
    const results = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(results);
  }, [searchTerm, notes]);

  return (
    <>
      {/* Navbar */}
      <div className="notes-navbar">
        <div className="notes-nav-title">Notes4Web</div>
        <div className="notes-nav-controls">
          <input
            type="text"
            className="notes-search"
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="notes-filter"
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
          >
            <option value="minhas">Minhas Notas</option>
            <option value="compartilhadas">Compartilhadas</option>
          </select>
          
          {/* Botão de Admin - Só aparece se isAdmin for true */}
          {isAdmin && (
            <Link to="/admin" className="notes-admin-button">
              Admin
            </Link>
          )}
          
          <Link to="/notes/new" className="notes-new-button">
            Nova Nota
          </Link>
        </div>
      </div>
      {/* Container principal */}
      <div className="notes-container">
      {loading ? (
        <div className="notes-loading">Carregando...</div>
      ) : error ? (
        <div className="notes-error">{error}</div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
                <div className="note-card-header">
                  <h2>{note.title || 'Sem título'}</h2>
                  <div className="note-actions">
                    <Link to={`/notes/edit/${note.id}`} className="note-edit">
                      Editar
                    </Link>
                    <button className="note-delete">Excluir</button>
                  </div>
                </div>
                <div className="note-content">
                  {note.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NotesScreen;