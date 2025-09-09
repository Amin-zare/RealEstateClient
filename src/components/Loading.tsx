import '../App.css';
import React from 'react';
import text from '../constants/text.json';

const Loading: React.FC = () => (
  <div className="loading" role="status" aria-live="polite">
    <span className="spinner" />
    <span style={{ marginLeft: '1rem' }}>{text.loading}</span>
  </div>
);

export default Loading;