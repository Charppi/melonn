import React, { useCallback, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'

export const Modal: React.FC<{ show: boolean, onClose(): void, title: string }> = ({ children, show, onClose, title }) => {

    const [modal, setModal] = useState<bootstrap.Modal>();

    const triggerModal = useCallback(() => {
        if (modal) {
            if (show) {
                modal.show()
            } else {
                modal.hide();
                onClose()
            }
        }
    }, [modal, onClose, show])

    const initModal = useCallback(() => {
        const modalReference = document.getElementById("modal") as HTMLDivElement
        const modal = new bootstrap.Modal(modalReference, { keyboard: false });
        modalReference.addEventListener('hidden.bs.modal', onClose);
        setModal(modal);
        return () => modalReference.removeEventListener('hidden.bs.modal', onClose);
    }, [setModal, onClose])


    useEffect(() => {
        const removeListener = initModal();
        return removeListener
    }, [initModal])

    useEffect(triggerModal, [triggerModal, show]);

    return <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">{title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    </div>
}
