import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../resources/style.css';
import '../../resources/notes_screen.css';
import ConfirmationModal from './ConfirmationModal';
import ShareNoteModal from './ShareNoteModal';
import NoteModal from './NoteModal';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteType, setNoteType] = useState('minhas');
  const [isAdmin, setIsAdmin] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [editingNote, setEditingNote] = useState(null); 
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [transitionState, setTransitionState] = useState('idle');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Novo estado para controle do modal de criação
  const [noteToShare, setNoteToShare] = useState(null);
  
  const handleShareNote = async (noteId, username) => {
    try {
      await api.post(`/notes/${noteId}/share`, { username });
      alert('Nota compartilhada com sucesso!');
      loadNotes(noteType); // Recarrega as notas para atualizar o estado
    } catch (err) {
      throw err; // O erro será tratado no modal
    }
  };


  const loadNotes = useCallback(async (type) => {
    setTransitionState('loading');
    try {
      const endpoint = type === 'minhas' ? '/notes' : '/notes/shared';
      const response = await api.get(endpoint);
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setTransitionState('idle');
    }
  }, []);

  useEffect(() => {
    loadNotes(noteType);
  }, [noteType, loadNotes]);

  const handleDeleteNote = async () => {
    try {
      await api.delete(`/notes/${noteToDelete.id}`);
      setNotes(notes.filter(n => n.id !== noteToDelete.id));
      setFilteredNotes(filteredNotes.filter(n => n.id !== noteToDelete.id));
      setNoteToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir nota:', err);
      alert('Erro ao excluir nota');
    }
  };

  const handleSaveNote = async (updatedNote) => {
    try {
      const isSharedNote = noteType === 'compartilhadas';
      const endpoint = isSharedNote 
        ? `/notes/shared/${updatedNote.id}` 
        : `/notes/${updatedNote.id}`;
      
      await api.put(endpoint, updatedNote);
      
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
      setFilteredNotes(filteredNotes.map(n => n.id === updatedNote.id ? updatedNote : n));
      setEditingNote(null);
      
    } catch (err) {
      console.error('Erro ao salvar nota:', err);
      alert('Erro ao salvar nota');
    }
  };

  const handleCreateNote = async (newNote) => {
    try {
      const response = await api.post('/notes', newNote);
      setNotes([response.data, ...notes]);
      setFilteredNotes([response.data, ...filteredNotes]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar nota:', err);
      alert('Erro ao criar nota');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get('/auth/me');
        setIsAdmin(userResponse.data.isAdmin || false);
        setCurrentUser(userResponse.data);
        
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
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="notes-new-button"
          >
            Nova Nota
          </button>
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

      {/* Modal de Edição */}
      {editingNote && (
        <NoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
          isShared={noteType === 'compartilhadas'}
        />
      )}

      {/* Modal de Criação */}
      {isCreateModalOpen && (
        <NoteModal
          note={{ title: '', content: '' }}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateNote}
          isNew={true}
        />
      )}
      
      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleDeleteNote}
      />
      
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
            onChange={(e) => {
              setNoteType(e.target.value);
              setFilteredNotes([]);
            }}
          >
            <option value="minhas">Minhas Notas</option>
            <option value="compartilhadas">Compartilhadas</option>
          </select>
        </div>
        {transitionState === 'loading' ? (
          <div className="notes-loading">Carregando...</div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-card-header">
                  <h2>{note.title || 'Sem título'}</h2>
                  <div className="note-actions">
                    <button 
                      onClick={() => setEditingNote(note)} 
                      className="note-edit"
                    >
                      Editar
                    </button>
                    {noteType === 'minhas' && (
                      <button 
                        onClick={() => setNoteToShare(note)} 
                        className="note-share"
                      >
                        Compartilhar
                      </button>
                    )}

                    {noteToShare && (
                      <ShareNoteModal
                        note={noteToShare}
                        onClose={() => setNoteToShare(null)}
                        onShare={handleShareNote}
                      />
                    )}
                    {noteType === 'minhas' && !note.shared && (
                      <button 
                        onClick={() => setNoteToDelete(note)} 
                        className="note-delete"
                      >
                        Excluir
                      </button>
                    )}
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