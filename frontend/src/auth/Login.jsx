import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ Extract and store room_code from URL on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomFromUrl = queryParams.get('room');
    if (roomFromUrl) {
      localStorage.setItem('room_code', roomFromUrl);
    }
  }, [location]);

  // ✅ Form validation using Yup
  const signinvalidation = yup.object({
    email: yup.string().email().required('Please enter your email'),
    pass: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      ),
  });

  // ✅ Submit form and login logic
  const handleSubmit = async ({ email, pass }) => {
    try {
      const formdata = new FormData();
      formdata.append('email', email);
      formdata.append('password', pass);

      const res = await axios.post('http://localhost:8080/tic-tac-toe/login.php', formdata);

      if (res.data) {
        const name = res.data.data.name;
        const player1_id = res.data.data.id;

        sessionStorage.setItem("name", name);
        sessionStorage.setItem("id", player1_id);

        alert("Login successfully");
        nav('/SelectionMenu');
      } else {
        alert('Failed to sign in. Please try again!');
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center min-vh-100'
      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      <Container className='p-4 shadow-lg rounded bg-white' style={{ maxWidth: "400px" }}>
        <h1 className='text-center mb-3 text-primary'>Sign In</h1>
        <Formik
          initialValues={{ email: "kevinr.patel26@gmail.com", pass: "K3v!n123" }}
          validationSchema={signinvalidation}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor='email'>Email</Form.Label>
                <Form.Control
                  type='email'
                  id='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                  placeholder='Enter email'
                  className='mb-3'
                  style={{ border: "2px solid #3949AB", borderRadius: "6px", padding: "10px" }}
                />
                <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor='pass'>Password</Form.Label>
                <Form.Control
                  type='password'
                  id='pass'
                  name='pass'
                  value={values.pass}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.pass && !!errors.pass}
                  placeholder='Enter password'
                  className='mb-3'
                  style={{ border: "2px solid #3949AB", borderRadius: "6px", padding: "10px" }}
                />
                <Form.Control.Feedback type='invalid'>{errors.pass}</Form.Control.Feedback>
              </Form.Group>

              <Button type='submit' variant='success' className='w-100'>Submit</Button>

              <p className='mt-3 text-center' style={{ color: "#333", fontWeight: '500' }}>
                Don't have an account? <Link to="/SignUp" className='signup-link' style={{ textDecoration: "none" }}>Register</Link>
              </p>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}
