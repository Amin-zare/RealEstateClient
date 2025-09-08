import React from 'react';
import { Link } from 'react-router-dom';
import text from '../constants/text.json';

const ByggAbPage: React.FC = () => {
    return (
        <div className="App home-center">
            <h2>{text.byggAbTitle}</h2>
            <p>{text.byggAbText}</p>
            <Link to="/" className="portal-btn" role="button">{text.backButton}</Link>
        </div>
    );
};

export default ByggAbPage;
