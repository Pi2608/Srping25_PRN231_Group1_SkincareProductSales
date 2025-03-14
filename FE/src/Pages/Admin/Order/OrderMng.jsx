import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import ApiGateway from "../../../Api/ApiGateway";
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Collapse, 
  IconButton, 
  Typography, 
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import "./OrderMng.css";

function Row(props) {
  const { order, onProcessOrder, onCompleteOrder } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return '#46FF40';
      case 'processing':
        return 'blue';
      case 'pending':
        return 'red';
      case 'canceled':
        return 'red';
      default:
        return 'black';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch(e) {
      return "N/A";
    }
  };

  const handleProcessOrder = async () => {
    setLoading(true);
    try {
      await onProcessOrder(order.id);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    setLoading(true);
    try {
      await onCompleteOrder(order.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{order.id}</TableCell>
        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
        <TableCell>
          <p style={{color:`${getStatusColor(order.status)}`}}>{order.status}</p> 
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            {order.status.toLowerCase() === 'pending' && (
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                startIcon={<LocalShippingIcon />} 
                onClick={handleProcessOrder}
                disabled={loading}
              >
                Process
              </Button>
            )}
            {order.status.toLowerCase() === 'processing' && (
              <Button 
                variant="contained" 
                color="success" 
                size="small" 
                startIcon={<CheckCircleOutlineIcon />}
                onClick={handleCompleteOrder}
                disabled={loading}
              >
                Complete
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>User ID:</strong> {order.userId}
                </Typography>
              </Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Product ID</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell component="th" scope="row">
                        {detail.productName}
                      </TableCell>
                      <TableCell>{detail.productId}</TableCell>
                      <TableCell align="right">{detail.quantity}</TableCell>
                      <TableCell align="right">${detail.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const OrderMng = () => {
  const [search, setSearch] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOrders = orderList.filter((order) =>
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ApiGateway.getAllOrders();
      setOrderList(response);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      showSnackbar("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessOrder = async (orderId) => {
    try {
      await ApiGateway.processOrder(orderId);
      showSnackbar("Order has been processed successfully", "success");
      // Refresh order list
      fetchOrders();
    } catch (error) {
      console.error("Error processing order:", error);
      showSnackbar("Failed to process order", "error");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await ApiGateway.completeOrder(orderId);
      showSnackbar("Order has been completed successfully", "success");
      // Refresh order list
      fetchOrders();
    } catch (error) {
      console.error("Error completing order:", error);
      showSnackbar("Failed to complete order", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <DashboardLayoutComponent>
      <div id="order_mng">
        <div className="table-container">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="div">
              Order Management
            </Typography>
            <Button 
              variant="outlined" 
              onClick={fetchOrders}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          <TextField
            label="Search orders by status"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            margin="normal"
            size="small"
            sx={{ mb: 2 }}
            fullWidth
          />
          <TableContainer>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <Row 
                      key={order.id} 
                      order={order} 
                      onProcessOrder={handleProcessOrder}
                      onCompleteOrder={handleCompleteOrder}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {loading ? "Loading orders..." : "No orders found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutComponent>
  );
};

export default OrderMng;