import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Card, Form as BootstrapForm, Button } from 'react-bootstrap';
import { baseURL } from '../services/api';

const Login = () => {
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required'),
    });

    const onSubmit = async (values) => {
        try {
            const response = await axios.post(`${baseURL}/admin/login`, values);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="text-center mb-4">Login</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ handleSubmit }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Email</BootstrapForm.Label>
                                <Field
                                    as={BootstrapForm.Control}
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </BootstrapForm.Group>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Password</BootstrapForm.Label>
                                <Field
                                    as={BootstrapForm.Control}
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </BootstrapForm.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </BootstrapForm>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default Login;