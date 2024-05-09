import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import AuthLogin from './FirebaseLogin';
import { auth } from '../../../config/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

const Signin1 = () => {

  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login (e.g., navigate to a different page)
      console.log("Login success")
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result)
      // Handle successful Google login (e.g., access user info from result)
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <AuthLogin
                errorMessage = {errorMessage}
                handleEmailLogin = {handleEmailLogin}
                handleGoogleLogin = {handleGoogleLogin}
              />
              <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to="/auth/reset-password-1" className="f-w-400">
                  Reset
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/auth/signup-1" className="f-w-400">
                  Signup
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
