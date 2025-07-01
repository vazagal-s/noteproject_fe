import React from "react";
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir esta nota?"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80%'
          }}>
            {title}
          </h3>
          <button onClick={onClose} className="modal-close-button">
            <span>X</span>
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onConfirm} 
            className="form-submit-aux" 
            style={{ 
              background: '#cc0000',
              flexShrink: 0 /* Impede que o botão diminua */
            }}
          >
            Confirmar
          </button>
          <button 
            onClick={onClose} 
            className="form-cancel"
            style={{ flexShrink: 0 }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;