import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { baseURL } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseURL}/user`);
                setUsers(response.data.data);
            } catch (error) {
                setErrorMessage('There was an error fetching the users.');
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/dashboard/users/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${baseURL}/user/${selectedUserId}`);
            setUsers(users.filter(user => user._id !== selectedUserId));
            setOpenDialog(false);
            setSuccessMessage('User successfully deleted.');
        } catch (error) {
            setErrorMessage('There was an error deleting the user.');
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <TableContainer component={Paper}
                sx={{
                    maxHeight: 440,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    minWidth: 800,
                    '@media (max-width: 600px)': { maxHeight: 300, width: '100%' }
                }}>
                <Button onClick={() => navigate("/dashboard/users/new")} variant="contained" sx={{ mb: 2 }}>
                    Add User
                </Button>
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            {["#", 'Name', 'Phone', 'Diagnostic', 'National ID', 'Notes', 'Actions'].map((header) => (
                                <TableCell
                                    key={header}
                                    align="center"
                                    sx={{
                                        fontWeight: 'bold',
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'white',
                                        zIndex: 2,
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' }
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user._id} hover>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{index + 1}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{user.name}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{user.phone}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{user.diagnostic}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{user.nationalId || 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{user.notes || 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(user._id)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(user._id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            {successMessage && (
                <Snackbar
                    open={Boolean(successMessage)}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage('')}
                    message={successMessage}
                />
            )}

            {/* Error Snackbar */}
            {errorMessage && (
                <Snackbar
                    open={Boolean(errorMessage)}
                    autoHideDuration={6000}
                    onClose={() => setErrorMessage('')}
                    message={errorMessage}
                />
            )}
        </>
    );
};

export default UserList;
