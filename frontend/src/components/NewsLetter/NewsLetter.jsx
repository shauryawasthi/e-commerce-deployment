import React from 'react';
import './NewsLetter.css';

const Newsletter = () => {
  return (
    <div className="newsletter-section">
      <div className="newsletter container">
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div className="newsletter-input-box">
          <input type="email" placeholder="Your Email id" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
