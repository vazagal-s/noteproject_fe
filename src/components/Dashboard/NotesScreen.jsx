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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  
  const handleShareNote = async (noteId, username) => {
    try {
      await api.post(`/notes/share`, { noteId, username});
      alert('Nota compartilhada com sucesso!');
      loadNotes(noteType);
    } catch (err) {
      throw err;
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
    if (!notes || notes.length === 0) {
      setFilteredNotes([]);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const results = notes.filter(item => {
      const note = item.note ? item.note : item;
      const safeTitle = (note.title || '').toLowerCase();
      const safeContent = (note.content || '').toLowerCase();
      return safeTitle.includes(lowerSearchTerm) || 
            safeContent.includes(lowerSearchTerm);
    });
    
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
    {/* Navbar (mantido igual) */}
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

    {/* Modais (mantidos iguais) */}
    {editingNote && (
      <NoteModal
        note={editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveNote}
        isShared={noteType === 'compartilhadas'}
      />
    )}

    {isCreateModalOpen && (
      <NoteModal
        note={{ title: '', content: '' }}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateNote}
        isNew={true}
      />
    )}
    
    <ConfirmationModal
      isOpen={!!noteToDelete}
      onClose={() => setNoteToDelete(null)}
      onConfirm={handleDeleteNote}
    />

    {/* Modal de Compartilhamento - Movido para fora da lista de notas */}
    {noteToShare && (
      <ShareNoteModal
        note={noteToShare}
        onClose={() => setNoteToShare(null)}
        onShare={handleShareNote}
      />
    )}
    
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
      ) : (<div className="notes-grid">
            {filteredNotes.map((item) => {
              // Verifica se é uma nota compartilhada (com estrutura aninhada)
              const note = item.note ? item.note : item;
              const ownerUsername = item.ownerUsername;

              return (
                  <div
                    key={`note-${note.id}`}
                    className="note-card"
                    data-shared={noteType === 'compartilhadas'}
                  >
                  <div className="note-card-header">
                    <h2>{note.title || 'Sem título'}</h2>
                    
                    {/* MOSTRA O OWNER APENAS PARA NOTAS COMPARTILHADAS */}
                    {noteType === 'compartilhadas' && ownerUsername && (
                      <div className="note-meta">
                        <span className="note-owner">Compartilhada por: {ownerUsername}</span>
                      </div>
                    )}
                  </div>
                  <div className="note-content">
                    {(note.content || '').split('\n').map((paragraph, i) => (
                      <p key={`note-${note.id}-para-${i}`}>
                        {paragraph || <br />}
                      </p>
                    ))}
                  </div>
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
              );
            })}
            </div>
          )}
    </div>
  </>
);
}

export default NotesScreen;