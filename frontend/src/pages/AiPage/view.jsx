import React from 'react';
import './ImageWithButtons.css';

function ImageWithButtons() {
    return (
        <div className="container">
            <img src="https://via.placeholder.com/800x600" alt="Placeholder" className="image" />
            <div className="buttons">
                <button className="button">Button 1</button>
                <button className="button">Button 2</button>
                <button className="button">Button 3</button>
                <button className="button">Button 4</button>
            </div>
        </div>
    );
}

export default ImageWithButtons;