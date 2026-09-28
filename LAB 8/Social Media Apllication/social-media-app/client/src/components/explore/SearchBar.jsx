import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

const SearchBar = () => {
  return (
    <InputGroup className="mb-4" style={{ borderRadius: '100px', overflow: 'hidden', border: '1px solid var(--m-line)', backgroundColor: 'var(--m-card)' }}>
      <InputGroup.Text className="bg-transparent border-0 pe-1" style={{ color: 'var(--m-ink-soft)' }}>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="SEARCH POSTS, PEOPLE, TOPICS"
        className="border-0 bg-transparent shadow-none"
        style={{ fontFamily: 'var(--m-font-mono)', fontSize: '0.85rem' }}
      />
    </InputGroup>
  );
};

export default SearchBar;
