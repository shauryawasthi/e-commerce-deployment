import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { API_URL } from "../config";   // ✅ config.js se backend URL import

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch(`${API_URL}/login`, {   // ✅ localhost ki jagah API_URL
      method: 'POST',
      headers: {
        Accept: 'application/json',     // ✅ sahi header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
        if (responseData.success) {
          localStorage.setItem('auth-token', responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.errors);
        }
      });
  };

  const signup = async () => {
    console.log("Signup Function Executed", formData);
    let responseData;
    await fetch(`${API_URL}/signup`, {   // ✅ localhost ki jagah API_URL
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
        if (responseData.success) {
          localStorage.setItem('auth-token', responseData.token);
          window.location.replace("/");
        } else {
          alert(responseData.errors);
        }
      });
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              type="text"
              onChange={changeHandler}
              name='username'
              value={formData.username}
              placeholder="Your Name"
            />
          )}
          <input
            onChange={changeHandler}
            name='email'
            value={formData.email}
            type="email"
            placeholder="Email Address"
          />
          <input
            onChange={changeHandler}
            name='password'
            value={formData.password}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup(); }}>Continue</button>

        {state === "Sign Up"
          ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
          : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
