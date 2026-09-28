import React, { useState } from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import IconButton from '../ui/IconButton';
import StampButton from '../ui/StampButton';
import PerforatedDivider from '../ui/PerforatedDivider';
import { createPost } from '../../services/api';

const CreatePostModal = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      await createPost({ content, imageUrl });
      handleClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered fullscreen="md-down" backdrop="static">
      <Modal.Header className="border-0 pt-4 pb-2 px-4 d-flex align-items-center justify-content-between">
        <div className="m-label fs-6 mb-0">NEW POST</div>
        <IconButton icon="bi-x-lg" onClick={handleClose} ariaLabel="Close" disabled={isSubmitting} />
      </Modal.Header>
      <Modal.Body className="px-4">
        {error && (
          <div className="alert alert-danger m-label p-2 mb-3" role="alert">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit} id="create-post-form">
          <div className="m-label mb-2">01 &mdash; WRITE</div>
          <Form.Group className="mb-1">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Start writing..."
              className="form-underline fs-5"
              style={{ fontFamily: 'var(--m-font-serif)', resize: 'none' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              autoFocus
              disabled={isSubmitting}
            />
          </Form.Group>
          <div className="text-end m-label mb-4" style={{ fontSize: '0.65rem' }}>
            {content.length} / 500
          </div>

          <div className="m-label mb-2">02 &mdash; IMAGE</div>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Paste image URL here..."
              className="form-underline mb-3"
              style={{ fontFamily: 'var(--m-font-mono)', fontSize: '0.85rem' }}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>

          {imageUrl ? (
            <div className="position-relative">
              <img 
                src={imageUrl} 
                alt="Preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--m-radius-media)', border: '1px solid var(--m-line)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <IconButton 
                icon="bi-x-circle-fill" 
                className="position-absolute top-0 end-0 m-2 text-white bg-dark bg-opacity-50"
                style={{ width: '30px', height: '30px' }}
                onClick={() => setImageUrl('')}
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <div 
              className="text-center p-4" 
              style={{ border: '2px dashed var(--m-line)', borderRadius: 'var(--m-radius-media)', backgroundColor: 'var(--m-paper-2)' }}
            >
              <i className="bi bi-image text-muted fs-3 mb-2 d-block"></i>
              <span className="m-label" style={{ fontSize: '0.7rem' }}>DROP AN IMAGE OR CLICK TO BROWSE</span>
            </div>
          )}
        </Form>
      </Modal.Body>
      <div className="px-4">
        <PerforatedDivider />
      </div>
      <Modal.Footer className="border-0 pb-4 px-4 pt-2 d-flex justify-content-between">
        <StampButton variant="outline" onClick={handleClose} disabled={isSubmitting}>
          CANCEL
        </StampButton>
        <StampButton variant="primary" type="submit" form="create-post-form" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? <Spinner size="sm" animation="border" /> : 'POST'}
        </StampButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePostModal;
