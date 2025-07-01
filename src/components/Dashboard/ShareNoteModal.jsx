import React, { useState } from 'react';

const ShareNoteModal = ({ note, onClose, onShare }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (!username.trim()) {
      setError('Por favor, insira um username');
      return;
    }

    setIsLoading(true);
    try {
      await onShare(note.id, username);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao compartilhar nota');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Compartilhar Nota</h3>
          <button onClick={onClose} className="modal-close-button">
            <span style={{ marginTop: '-2px', display: 'block' }}>X</span>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Compartilhar com:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite o username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={handleShare}
            className="form-submit-aux"
            disabled={isLoading}
          >
            {isLoading ? 'Compartilhando...' : 'Compartilhar'}
          </button>
          <button onClick={onClose} className="form-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareNoteModal;