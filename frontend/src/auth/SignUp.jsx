import { Formik} from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SignUp() {
  const nav=useNavigate();
  const [error, setError] = useState('');  

  const signupValidation = yup.object({
    name: yup.string().min(3).required('Please enter your name.'),
    email: yup.string().email().required('Please enter your email'),
    pass: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      )
  });

  const handleSubmit = async ({ name, email, pass }) => {
    try {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('email', email);
      formdata.append('password', pass);
  
      const res = await axios.post('https://tac-trix.wuaze.com/apis/signup.php', formdata);
  
      if (res.data.status === "yes") {
        alert("signup successfully!");
        nav('/Login');
      }   else {
        if (res.data.message === "Email already exists") {
          // console.log(res.data)
          setError("Email is already registered! Please use another one.");
        } else {
          setError("Signup failed! Try again.");
        }
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong!");
    }
  };
  
  

  return (
    <div className='d-flex justify-content-center align-items-center min-vh-100' style={{
      background: 'linear-gradient(135deg, #667eea, #764ba2)'
    }}>
      <Container className='p-4 shadow-lg rounded bg-white' style={{ maxWidth: "400px" }}>
        <h1 className='text-center mb-3 text-primary'>Sign Up</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <Formik
          initialValues={{ name: "", email: "", pass: "" }}
          validationSchema={signupValidation}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor='name'>Name</Form.Label>
                <Form.Control
                  type='text'
                  id='name'
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && !!errors.name}
                  placeholder='Enter name'
                  className='mb-3'
                  style={{ border: "2px solid #3949AB", borderRadius: "6px", padding: "10px" }}
                />
                <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor='email'>Email</Form.Label>
                <Form.Control
                  type='email'
                  id='email'
                  name='email'
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.pass && !!errors.pass}
                  placeholder='Enter password'
                  className='mb-3'
                  style={{ border: "2px solid #3949AB", borderRadius: "6px", padding: "10px" }}
                />
                <Form.Control.Feedback type='invalid'>{errors.pass}</Form.Control.Feedback>
              </Form.Group>

              <Button type='submit' variant='success' className='w-100'>Submit</Button>

              <p className="mt-3 text-center" style={{ color: '#333', fontWeight: '500' }}>
                Already have an account?
                <Link to="/Login" className="login-link" style={{ textDecoration: "none" }}> Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  )
}
