import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase functions

const SignUp1 = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const { email, password } = event.target.elements;

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      // Handle successful signup (e.g., redirect to another page)
      console.log('Signup successful!');
      navigate("/login")
    } catch (error) {
      setErrorMessage(error.message); // Set error message
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
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <form onSubmit={handleSignup}>
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" placeholder="Username" name="username" required />
                    </div>
                    <div className="input-group mb-3">
                      <input type="email" className="form-control" placeholder="Email address" name="email" required />
                    </div>
                    <div className="input-group mb-4">
                      <input type="password" className="form-control" placeholder="Password" name="password" required />
                    </div>
                    <div className="form-check text-start mb-4 mt-2">
                      <input type="checkbox" className="form-check-input" id="customCheck1" defaultChecked={false} />
                      <label className="form-check-label" htmlFor="customCheck1">
                        Send me the <Link to="#"> Newsletter</Link> weekly.
                      </label>
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button className="btn btn-primary mb-4">Sign up</button>
                  </form>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
