import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { baseURL } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check'; // Import CheckIcon for success alert

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        diagnostic: '',
        notes: '',
        nationalId: '',
        mobile: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // For editing user by ID

    // Fetch user data if in edit mode
    useEffect(() => {
        if (id) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${baseURL}/user/${id}`);
                    setFormData(response.data.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setErrorMessage('Error fetching user data.');
                }
            };
            fetchUserData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clean the data by removing any empty optional fields
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value.trim() !== '')
        );

        try {
            if (id) {
                // Editing an existing user
                const response = await axios.put(`${baseURL}/user/${id}`, cleanedData);
                setSuccessMessage(response.data.message);
            } else {
                // Adding a new user
                const response = await axios.post(`${baseURL}/user`, cleanedData);
                setSuccessMessage(response.data.message);
            }
            setErrorMessage('');
            setFormData({
                name: '',
                phone: '',
                diagnostic: '',
                notes: '',
                nationalId: '',
                mobile: ''
            });
            navigate('/dashboard/users');
        } catch (error) {
            console.error('Error submitting user:', error);
            setErrorMessage(error.message);
            setSuccessMessage('');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                {id ? 'Edit User' : 'Create User'}
            </Typography>

            {/* Success and Error Alert */}
            {successMessage && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ marginBottom: 2 }}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Diagnostic"
                    name="diagnostic"
                    value={formData.diagnostic}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="National ID"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {id ? 'Update User' : 'Create User'}
                </Button>
            </form>
        </Container>
    );
};

export default UserForm;
