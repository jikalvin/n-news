import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase functions
import { auth } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';

const FirebaseLogin = ({ className, ...rest }) => {
  const navigate = useNavigate()

  const handleLogin = async (values, { setSubmitting, setStatus }) => {
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      navigate("/app/overview")
    } catch (error) {
      setStatus({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                label="Email Address / Username"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                label="Password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
            </div>

            {errors.submit && (
              <Col sm={12}>
                <Alert variant="danger">{errors.submit}</Alert>
              </Col>
            )}

            <Row>
              <Col mt={2}>
                <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit">
                  Signin
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>

      {/* ... your Google sign-in button and other sections ... */}
    </React.Fragment>
  );
};

FirebaseLogin.propTypes = {
  className: PropTypes.string,
};

export default FirebaseLogin;
