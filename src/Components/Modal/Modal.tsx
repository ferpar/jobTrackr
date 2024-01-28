import { observer } from "mobx-react";
import classes from "./Modal.module.css";

const Modal = observer(({ presenter }) => {
  if (!presenter) {
    console.error("Modal component must be passed a presenter prop");
    return
  } 
  const { isModalOpen: isOpen, closeModal: onClose } = presenter; 
  const modalStyle = {
    display: isOpen ? 'flex' : 'none', // Or use visibility and opacity for transitions
  };

  console.log('notes', presenter.notesBuffer)

  return (
    <div className={classes.modalOverlay} style={modalStyle} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        {presenter.notesBuffer}
      </div>
    </div>
  );
});

export default Modal;