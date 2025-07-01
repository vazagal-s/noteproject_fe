import React from 'react';

const NoteModal = ({ note, onClose, onSave, isShared, isNew = false }) => {
  const [title, setTitle] = React.useState(note.title || '');
  const [content, setContent] = React.useState(note.content || '');
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {isNew ? 'Criar Nota' : 'Editar Nota'} 
            {isShared && <span>(Compartilhada)</span>}
          </h3>
          <button onClick={onClose} className="modal-close-button">
            <span style={{ marginTop: '-2px', display: 'block' }}>X</span>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Título:</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={25}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Conteúdo:</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={() => onSave({ ...note, title, content })}
            className="form-submit-aux"
          >
            {isNew ? 'Criar' : 'Salvar'}
          </button>
          <button onClick={onClose} className="form-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;