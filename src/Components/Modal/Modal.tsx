import React from "react";
import { observer } from "mobx-react";
import classes from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
};

const Modal = observer(({ isOpen, onClose, content }: ModalProps) => {
  const modalStyle = {
    display: isOpen ? "flex" : "none", // Or use visibility and opacity for transitions
  };

  const closeBtnRef= React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
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
        <p>{content}</p>
        <button ref={closeBtnRef} onClick={onClose} className={classes.closeBtn}>
          X
        </button>
      </div>
    </div>
  );
});

export default Modal;
