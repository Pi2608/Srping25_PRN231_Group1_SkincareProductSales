import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ApiGateway from '../../Api/ApiGateway';

const EditModal = ({ type, object, open, onEdit, onClose }) => {
    const [formData, setFormData] = useState({
        account: object.account,
        password: object.password,
        email: object.email,
        address: object.address,
        roleId: object.roleId
    });
    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const response = await ApiGateway.getRoles(); 
        setRoles(response);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const allowedFields = ["account", "password", "email", "address", "roleId"];

    const userFields = object 
        ? Object.keys(object)
            .filter(key => allowedFields.includes(key))
            .map(key => ({
                name: key,
                type: key === "email" ? "email" : 
                      key === "roleId" ? "select" : 
                      key === "password" ? "password" : "text",
                placeholder: key.charAt(0).toUpperCase() + key.slice(1),
                options: key === "roleId" ? roles.map(role => ({ value: role.id, label: role.roleName })) : null
            }))
        : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(object.id, formData);
        onClose();
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
  
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event) => {
                        handleSubmit(event);
                    },
                },
            }}
        >
            <DialogTitle>Edit {type}</DialogTitle>
            <DialogContent
                dividers={true}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    padding: '20px',
                }}
            >
                {userFields.map((field, i) => (
                    field.type === "select" ? (
                        <Select 
                            key={i} 
                            name={field.name} 
                            value={formData.roleId} 
                            onChange={handleChange} 
                            size='small'
                            label={field.placeholder}
                        >
                            {field.options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    ) : (
                        <TextField
                            key={i}
                            required
                            name={field.name}
                            label={field.placeholder}
                            type={field.name === "password" ? (showPassword ? "text" : "password") : field.type}
                            size="small"
                            variant="outlined"
                            value={formData[field.name]}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: field.name === "password" ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide password' : 'show password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                        />
                    )
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditModal;