import React from 'react'
import './Modal.css'

const Modal = ({children, onClose}) => {
  return (
    <div id="modal">
        <div className="modal-container">
          <div className="close" onClick={() => onClose()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
          </div>
          {children}
        </div>
    </div>
  )
}

export default Modal