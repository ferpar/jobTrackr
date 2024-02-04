import { observer } from "mobx-react";
import Modal from "../../../Components/Modal/Modal";
import { ApplicationsPresenter } from "../../ApplicationsPresenter";

const ModalWrapper = observer(({ presenter }: { presenter: ApplicationsPresenter}) => {
    const { isModalOpen: isOpen, closeModal: onClose, notesBuffer: content } = presenter;
    return (
        <Modal isOpen={isOpen} onClose={onClose} content={content}/>
    )
})
    
export default ModalWrapper
