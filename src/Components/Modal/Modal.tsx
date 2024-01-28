import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const modalStyle = {
    display: isOpen ? 'block' : 'none', // Or use visibility and opacity for transitions
  };

  return (
    <div className="modal-overlay" style={modalStyle} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;