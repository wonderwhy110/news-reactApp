const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title || 'Подтверждение'}</h3>
        <p>{message || 'Вы уверены?'}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Отмена
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;