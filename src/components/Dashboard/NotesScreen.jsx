import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [isAdmin, setIsAdmin] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verifica se o usuário é admin
        const userResponse = await api.get('/auth/me');
        setIsAdmin(userResponse.data.isAdmin || false);
        setCurrentUser(userResponse.data);
        
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleLogoutDropdown = () => {
    setShowLogout(!showLogout);
  };

  // Get initials for user icon (first letter of username or fallback to 'U')
  const userInitial = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Navbar */}
      <div className="notes-navbar">
        <div className="notes-nav-title">Notes4Web</div>
        <div className="notes-nav-controls">
          {isAdmin && (
            <Link to="/admin" className="notes-admin-button">
              Admin
            </Link>
          )}
          <Link to="/notes/new" className="notes-new-button">
            Nova Nota
          </Link>
          <div className="user-icon-container">
            <div className="user-icon" onClick={toggleLogoutDropdown}>
              {userInitial}
            </div>
            {showLogout && (
              <div className="logout-dropdown">
                <button className="logout-button" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Container principal */}
      <div className="notes-container">
        <div className="search-container">
          <input
            type="text"
            className="notes-search"
            placeholder="🔍 Buscar em todas as notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="notes-filter"
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
          >
            <option value="minhas">Minhas Notas</option>
            <option value="compartilhadas">Notas Compartilhadas</option>
          </select>
        </div>
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