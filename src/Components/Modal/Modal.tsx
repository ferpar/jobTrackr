import React from "react";
import { observer } from "mobx-react";
import classes from "./Modal.module.css";

const Modal = observer(({ presenter }) => {
  if (!presenter) {
    console.error("Modal component must be passed a presenter prop");
    return;
  }
  const { isModalOpen: isOpen, closeModal: onClose } = presenter;
  const modalStyle = {
    display: isOpen ? "flex" : "none", // Or use visibility and opacity for transitions
  };

  const closeBtnRef= React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  React.useEffect(() => {
    const currentlyFocused = document.activeElement as HTMLElement | null;
    if (!isOpen) return;
    if(!closeBtnRef.current) return;
    closeBtnRef.current?.focus();

    return () => {
      currentlyFocused?.focus();
    }

  }, [isOpen]);

  return (
    <div className={classes.modalOverlay} style={modalStyle} onClick={onClose}>
      <div
        className={classes.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <p>{presenter.notesBuffer}</p>
        <button ref={closeBtnRef} onClick={onClose} className={classes.closeBtn}>
          X
        </button>
      </div>
    </div>
  );
});

export default Modal;
