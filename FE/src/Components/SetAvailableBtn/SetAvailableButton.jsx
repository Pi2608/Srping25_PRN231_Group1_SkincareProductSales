import React from 'react';
import { Button, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ApiGateway from '../../Api/ApiGateway';
import { toast } from 'react-toastify';

const SetAvailableButton = ({ product, onProductUpdated }) => {
  const canSetAvailable = product.isDeleted && product.details && product.details.length > 0;
  
  const handleSetAvailable = async () => {
    if (!canSetAvailable) {
      toast.error("Cannot set product available. Add at least one product detail first.");
      return;
    }
    
    try {
      // Call API to update product availability
      await ApiGateway.setProductAvailable(product.id);
      toast.success("Product is now available!");
      
      // Call the callback to refresh product data
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (error) {
      console.error("Error setting product availability:", error);
      toast.error("Failed to update product availability.");
    }
  };

  return (
    <Tooltip 
      title={!canSetAvailable && product.isDeleted ? 
        "Add at least one product detail before making available" : 
        "Set product as available"}
    >
      <span>
        <Button
          variant="outlined"
          color="success"
          onClick={handleSetAvailable}
          disabled={!canSetAvailable}
        >
          Set Available
        </Button>
      </span>
    </Tooltip>
  );
};

export default SetAvailableButton;