import React, { useState, useEffect } from 'react';
import {
    TextField, Button, MenuItem, Select, FormControl, InputLabel, FormLabel, Snackbar, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const MaterialForm = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('link');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [description, setDescription] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch categories once on component mount
    useEffect(() => {
        axios.get(`${baseURL}/category`)
            .then(response => setCategories(response.data.data))
            .catch(error => setError('Error fetching categories'));
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (category) {
            axios.get(`${baseURL}/subcategory?category=${category}`)
                .then(response => setSubCategories(response.data.data))
                .catch(error => setError('Error fetching subcategories'));
        } else {
            setSubCategories([]);
        }
    }, [category]);

    // Fetch existing material if editing
    useEffect(() => {
        if (id) {
            axios.get(`${baseURL}/material/${id}`)
                .then(response => {
                    const material = response.data.data;
                    setName(material.name);
                    setType(material.type);
                    setCategory(material.category);
                    setSubCategory(material.subCategory);
                    setDescription(material.description);
                    setLink(material.link || '');
                    setFile(material.file || null);
                })
                .catch(error => setError('Error fetching material'));
        }
    }, [id]);

    // Handle form submission (create or edit)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('description', description);

        if (type === 'link') {
            formData.append('link', link);
        } else if (file) {
            formData.append('file', file);
        }

        try {
            const response = id
                ? await axios.put(`${baseURL}/material/${id}`, formData, {
                    headers: { "Content-Type": "application/json" }
                })
                : await axios.post(`${baseURL}/material`, formData, {
                    headers: { "Content-Type": "application/json" }
                });
            console.log('Material saved successfully:', response.data);
            navigate('/dashboard/materials');
        } catch (error) {
            setError('Error saving material');
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const uploadFormData = new FormData();
        uploadFormData.append('image', uploadedFile);
        try {
            const response = await axios.post(`${baseURL}/upload`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(response.data.data.fileUrl);
        } catch (error) {
            setError('Error uploading file');
        }
    };

    return (
        <>
            {error && <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} />}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {!id && (
                    <>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Type</FormLabel>
                            <Select value={type} onChange={(e) => setType(e.target.value)} required>
                                <MenuItem value="link">Link</MenuItem>
                                <MenuItem value="file">File</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Category</FormLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <MenuItem value=''>Select a category</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Subcategory</FormLabel>
                            <Select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                required
                            >
                                <MenuItem value=''>Select a subcategory</MenuItem>
                                {subCategories.map((subCat) => (
                                    <MenuItem key={subCat._id} value={subCat._id}>{subCat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}

                {!id && type === 'link' && (
                    <TextField
                        label="Link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                )}

                {!id && type === 'file' && (
                    <input type="file" onChange={handleFileUpload} style={{ margin: '10px 0' }} />
                )}

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !name || !category || !subCategory || (type === 'link' && !link) || (type === 'file' && !file)}
                >
                    {loading ? <CircularProgress size={24} /> : id ? 'Update Material' : 'Create Material'}
                </Button>
            </form>
        </>
    );
};

export default MaterialForm;
