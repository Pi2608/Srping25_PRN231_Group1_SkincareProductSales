import React,{ useState, useEffect } from 'react'
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';
import ApiGateway from '../../Api/ApiGateway';

const EditModal = ({ type, object, open, onEdit, onClose }) => {
    const [formData, setFormData] = useState({
        account: object.account,
        email: object.email,
        address: object.address,
        roleId: object.roleId
    });
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchRoles();
        console.log(formData)
    }, []);

    const fetchRoles = async () => {
        const response = await ApiGateway.getRoles(); 
        setRoles(response);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
    };

    const allowedFields = ["account", "email", "address", "roleId"];

    const userFields = object 
        ? Object.keys(object)
            .filter(key => allowedFields.includes(key))
            .map(key => ({
                name: key,
                type: key === "email" ? "email" : key === "roleId" ? "select" : "text",
                placeholder: key.charAt(0).toUpperCase() + key.slice(1),
                // value: object[key] || "",
                options: key === "roleId" ? roles.map(role => ({ value: role.id, label: role.roleName })) : null
            }))
    : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(formData);
        onClose();
    };

    useEffect(() => {
        console.log(userFields)
    },[])

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
                {userFields.map((field, i) =>(
                    field.type === "select" ? (
                        <Select key={i} name={field.name} value={formData.roleId} onChange={handleChange} size='small'>
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
                            type={field.type}
                            size="small"
                            variant="outlined"
                            value={formData[field.name]}
                            onChange={handleChange}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
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
