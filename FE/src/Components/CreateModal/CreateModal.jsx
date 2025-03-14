import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Select, 
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@mui/material';
import ApiGateway from '../../Api/ApiGateway';

const CreateModal = ({ type, open, onCreate, onClose }) => {
    const initialState = {
        User: 
            {
                account: '',
                email: '',
                address: '',
                password: '',
                roleId: ''
            },
        Product: 
            {
                name: '',
                image: '',
                shortDescription: '',
                categoryId: '',
                price: ''
            },
        Voucher: 
            {
                code: '',
                discountPercentage: '',
                expiredDate: ''
            },
    };

    const [formData, setFormData] = useState(initialState[type] || {});
    const [roles, setRoles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        setFormData(initialState[type] || {});
        
        if (type === 'User') {
            fetchRoles();
        } else if (type === 'Product') {
            fetchCategories();
        }
    }, [type]);

    const fetchRoles = async () => {
        try {
        const response = await ApiGateway.getRoles();
        setRoles(response);
        } catch (error) {
        console.error("Error fetching roles:", error);
        }
    };

    const fetchCategories = async () => {
        try {
        const response = await ApiGateway.getAllCategories();
        setCategories(response);
        } catch (error) {
        console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
    };

    const getFieldConfig = () => {
        switch(type) {
            case 'User':
                return [
                    { name: 'account', type: 'text', label: 'Account' },
                    { name: 'email', type: 'email', label: 'Email' },
                    { name: 'password', type: 'password', label: 'Password' },
                    { name: 'address', type: 'text', label: 'Address' },
                    { 
                        name: 'roleId', 
                        type: 'select', 
                        label: 'Role',
                        options: roles.map(role => ({ value: role.id, label: role.roleName }))
                    }
                ];
            case 'Product':
                return [
                    { name: 'name', type: 'text', label: 'Product Name' },
                    { name: 'image', type: 'text', label: 'Image URL' },
                    { name: 'shortDescription', type: 'text', label: 'Description' },
                    { name: 'price', type: 'number', label: 'Price' },
                    { 
                        name: 'categoryId', 
                        type: 'select', 
                        label: 'Category',
                        options: categories.map(category => ({ value: category.id, label: category.name }))
                    }
                ];
            case 'Voucher':
                return [
                    { name: 'code', type: 'text', label: 'Voucher Code' },
                    { name: 'discountPercentage', type: 'number', label: 'Discount (%)' },
                    { name: 'expiredDate', type: 'date', label: 'Expiry Date' }
                ];
            default:
                return [];
        }
    };

    const fields = getFieldConfig();

    return (
        <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        >
            <DialogTitle>{`Create ${type}`}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {fields.map((field, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                {field.type === "select" ? (
                                    <FormControl fullWidth size="small">
                                        <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                                        <Select
                                            labelId={`${field.name}-label`}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            label={field.label}
                                        >
                                            {field.options?.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        fullWidth
                                        required
                                        name={field.name}
                                        label={field.label}
                                        type={field.type}
                                        size="small"
                                        variant="outlined"
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        multiline={field.multiline}
                                        rows={field.multiline ? 4 : 1}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateModal;