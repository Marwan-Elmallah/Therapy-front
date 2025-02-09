import React, { useState, useEffect } from 'react';
import { MenuItem, Select, InputLabel, FormControl, Button, Checkbox, ListItemText, OutlinedInput, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const InvitationForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [Materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${baseURL}/user`)
            .then(response => setUsers(response.data.data))
            .catch(error => setError('Error fetching users.'))
            .finally(() => setLoading(false));

        setLoading(true);
        axios.get(`${baseURL}/material`)
            .then(response => setMaterials(response.data.data))
            .catch(error => setError('Error fetching materials.'))
            .finally(() => setLoading(false));
    }, []);

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleMaterialsChange = (event) => {
        const { target: { value } } = event;
        setSelectedMaterials(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${baseURL}/invitation`, { user: selectedUser, material: selectedMaterials })
            .then(response => {
                setSuccessMessage('Invitation created successfully!');
                navigate('/dashboard/invitations');
                setSelectedUser('');
                setSelectedMaterials([]);
            })
            .catch(error => {
                setError('Error creating invitation. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="user-select-label">User</InputLabel>
                    <Select
                        labelId="user-select-label"
                        value={selectedUser}
                        onChange={handleUserChange}
                        required
                        input={<OutlinedInput label="User" />}
                    >
                        {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="Materials-select-label">Material</InputLabel>
                    <Select
                        labelId="Materials-select-label"
                        multiple
                        value={selectedMaterials}
                        onChange={handleMaterialsChange}
                        required
                        input={<OutlinedInput label="Material" />}
                        renderValue={(selected) => selected.map(id => {
                            const material = Materials.find(material => material._id === id);
                            return material ? material.name : '';
                        }).join(', ')}
                    >
                        {Materials.map((material) => (
                            <MenuItem key={material._id} value={material._id}>
                                <Checkbox checked={selectedMaterials.indexOf(material._id) > -1} />
                                <ListItemText primary={material.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" disabled={loading || selectedUser === '' || selectedMaterials.length === 0}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                </Button>
            </form>

            {error && (
                <Snackbar
                    open={Boolean(error)}
                    message={error}
                    onClose={() => setError(null)}
                    autoHideDuration={4000}
                />
            )}

            {successMessage && (
                <Snackbar
                    open={Boolean(successMessage)}
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                    autoHideDuration={4000}
                />
            )}
        </>
    );
};

export default InvitationForm;
