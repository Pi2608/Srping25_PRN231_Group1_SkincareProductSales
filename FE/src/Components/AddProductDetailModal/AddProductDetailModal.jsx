import React, { useState } from 'react';
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
FormControl,
InputLabel,
FormHelperText,
Box,
Typography,
InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ApiGateway from '../../Api/ApiGateway';
import { toast } from 'react-toastify';

const AddProductDetailModal = ({ open, product, onClose, onAdd }) => {
const [productDetail, setProductDetail] = useState({
    productId: product?.id || '',
    size: '',
    stockQuantity: '',
    description: '',
    price: ''
});

const [errors, setErrors] = useState({});

const validate = () => {
    const newErrors = {};
    
    if (productDetail.size  <= 0) {
        newErrors.size = 'Size must be greater than 0';
    }
    
    if (productDetail.stockQuantity <= 0) {
        newErrors.stockQuantity = 'Stock quantity must be greater than 0';
    }
    
    if (!productDetail.description) {
        newErrors.description = 'Description is required';
    }
    
    if (productDetail.price <= 0) {
        newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    // if (name === 'stockQuantity' || name === 'price') {
    //     processedValue = Number(value);
    // }

    setProductDetail({
        ...productDetail,
        [name]: processedValue
    });
};

const handleSubmit = async () => {
    if (!validate()) return;

    console.log('Product Detail:', productDetail);
    
    try {
        await onAdd(productDetail);
    } catch (error) {
        console.error('Error adding product detail:', error);
    }
};

return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Add Product Detail for {product?.name}</Typography>
                <Button onClick={onClose} color="inherit">
                    <CloseIcon />
                </Button>
            </Box>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                <FormControl fullWidth error={!!errors.size}>
                    <TextField
                        label="Size"
                        type="number"
                        name="size"
                        value={productDetail.size}
                        onChange={handleInputChange}
                        margin="dense"
                        error={!!errors.size}
                        helperText={errors.size}
                        placeholder="Size"
                    />
                </FormControl>
            
                <FormControl fullWidth error={!!errors.stockQuantity}>
                    <TextField
                        label="Stock Quantity"
                        name="stockQuantity"
                        type="number"
                        value={productDetail.stockQuantity}
                        onChange={handleInputChange}
                        margin="dense"
                        error={!!errors.stockQuantity}
                        helperText={errors.stockQuantity}
                    />
                </FormControl>
            
                <FormControl fullWidth error={!!errors.description}>
                    <TextField
                        label="Description"
                        name="description"
                        value={productDetail.description}
                        onChange={handleInputChange}
                        margin="dense"
                        error={!!errors.description}
                        helperText={errors.description}
                        multiline
                        rows={3}
                    />
                </FormControl>
            
                <FormControl fullWidth error={!!errors.price}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={productDetail.price}
                        onChange={handleInputChange}
                        margin="dense"
                        error={!!errors.price}
                        helperText={errors.price}
                        min={50000}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">VND</InputAdornment>
                        }}
                    />
                </FormControl>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary" variant="outlined">
                Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
                Add Detail
            </Button>   
        </DialogActions>
    </Dialog>
);
};

export default AddProductDetailModal;