import React from "react";
import "./Modal.css";

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{title}</h2>
                {children}
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
