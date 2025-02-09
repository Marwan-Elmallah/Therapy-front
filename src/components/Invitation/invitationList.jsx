import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Snackbar } from '@mui/material';
import { baseURL } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const InvitationList = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const addNew = () => {
        navigate("/dashboard/invitations/new");
    }

    useEffect(() => {
        setLoading(true);
        axios.get(`${baseURL}/invitation`)
            .then(response => {
                setInvitations(response.data.data);
            })
            .catch(error => {
                setError('Error fetching invitations.');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Button onClick={addNew} variant="contained" sx={{ mb: 2 }}>
                Add Invitation
            </Button>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            {error && (
                <Snackbar
                    open={Boolean(error)}
                    message={error}
                    onClose={() => setError(null)}
                    autoHideDuration={4000}
                />
            )}

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 440,
                    overflowY: 'auto',
                    width: '100%',
                    '@media (max-width: 600px)': { maxHeight: 300 }
                }}
            >
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            {["#", "User", "Material"].map((header) => (
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
                        {invitations.map((invitation, index) => (
                            <TableRow key={invitation._id} hover>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{index + 1}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{invitation.user.name}</TableCell>
                                <TableCell align="center" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                                    {invitation.material.map((item) => item.name).join(', ')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default InvitationList;
