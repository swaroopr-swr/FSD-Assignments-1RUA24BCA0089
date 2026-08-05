import React from 'react';

function ContactModal({ isOpen, onClose, phone, email }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <span className="modal-label">CONTACT DETAILS</span>
        <h2 className="modal-title">Let's connect.</h2>
        <p className="modal-description">
          Feel free to reach out for collaborations, projects, or technology conversations.
        </p>

        <div className="modal-contact-box">
          <span className="box-label">PHONE</span>
          <div className="box-content">
            <span className="box-value">+91 {phone}</span>
            <a href={`tel:+91${phone}`} className="box-link">Call ↗</a>
          </div>
        </div>

        <div className="modal-contact-box">
          <span className="box-label">EMAIL</span>
          <div className="box-content">
            <span className="box-value">{email}</span>
            <a href={`mailto:${email}`} className="box-link">Email ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
