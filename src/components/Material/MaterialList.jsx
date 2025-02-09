import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, CircularProgress, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MaterialList = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    // Fetch materials
    useEffect(() => {
        axios.get(`${baseURL}/material`)
            .then(response => {
                setMaterials(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching materials', error);
                setLoading(false);
            });
    }, []);

    // Handle delete operation
    const handleDelete = (id) => {
        axios.delete(`${baseURL}/material/${id}`)
            .then(() => {
                setMaterials(materials.filter(material => material._id !== id));
                alert('Material deleted successfully');
            })
            .catch(error => {
                console.error('There was an error deleting the material!', error);
                alert('Failed to delete material');
            });
    };

    // Navigate to edit page
    const handleEdit = (id) => {
        navigate(`/dashboard/materials/edit/${id}`);
    };

    // Handle pagination change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Table Row Component
    const MaterialRow = ({ material, onEdit, onDelete }) => (
        <TableRow key={material._id} hover>
            <TableCell align="center">{material.name}</TableCell>
            <TableCell align="center">{material.category.name}</TableCell>
            <TableCell align="center">{material.subCategory.name}</TableCell>
            <TableCell align="center">{material.description}</TableCell>
            <TableCell align="center">
                <IconButton onClick={() => {
                    if (material.link) {
                        window.open(material.link, '_blank');
                    } else {
                        alert('No link available');
                    }
                }}>
                    <PreviewIcon fontSize="small" />
                </IconButton>
            </TableCell>
            <TableCell align="center">
                <IconButton onClick={() => onEdit(material._id)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => onDelete(material._id)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Button onClick={() => navigate("/dashboard/materials/new")} variant="contained" sx={{ mb: 2 }}>
                Add Material
            </Button>

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
                            {['Name', 'Category', 'Subcategory', 'Description', 'Link', 'Actions'].map((header) => (
                                <TableCell
                                    key={header}
                                    align="center"
                                    sx={{
                                        fontWeight: 'bold',
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'white',
                                        zIndex: 2,
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                        padding: { xs: '8px', sm: '12px' },
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((material) => (
                            <MaterialRow
                                key={material._id}
                                material={material}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={materials.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default MaterialList;
