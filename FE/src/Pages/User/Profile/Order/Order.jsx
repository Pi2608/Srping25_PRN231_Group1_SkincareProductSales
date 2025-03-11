import React, { useState, useEffect } from 'react';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import ConfirmModal from '../../../../Components/ConfirmModal/ConfirmModal.jsx';
import Status from '../../../../Enum/Status.js';
import ApiGateway from '../../../../Api/ApiGateway';
import { useAuth } from '../../../../AuthContext/AuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './Order.css';

const mockOrders = [
    {
        id: '1',
        totalPrice: 3360000,
        status: Status.Pending,
        orderDetails: [
            {
                id: '11',
                productId: '2',
                productName: 'Hydra Boost Cream',
                quantity: 2,
                totalPrice: 2160000
            },
            {
                id: '12',
                productId: '3',
                productName: 'Brightening Essence',
                quantity: 1,
                totalPrice: 1200000
            }
        ],
        orderVouchers: [
            { id: '21', code: 'HAVEN10', discountPercentage: 10 }
        ]
    },
    {
        id: '2',
        totalPrice: 936000,
        status: Status.Completed,
        orderDetails: [
            {
                id: '13',
                productId: '6',
                productName: 'Deep Nourish Mask',
                quantity: 1,
                totalPrice: 936000
            }
        ],
        orderVouchers: []
    }
];

const Order = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        } else {
            setOrders(mockOrders);
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await ApiGateway.getOrderById(user.id);
            setOrders(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const cancelOrder = async () => {
        setLoading(true);
        try {
            await ApiGateway.cancelOrder(selectedOrderId);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === selectedOrderId ? { ...order, status: Status.Canceled } : order
                )
            );
            alert('Order canceled successfully.');
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order.');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <ProfileLayout>
            <main id="orders">
                <h1>My Orders</h1>
                <div className="content">
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>Order</TableCell>
                                        <TableCell>Products</TableCell>
                                        <TableCell>Vouchers</TableCell>
                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell align='center'>{order.id}</TableCell>
                                            <TableCell>
                                                <ul>
                                                    {order.orderDetails.map((detail) => (
                                                        <li key={detail.id}>
                                                            {detail.productName} - {detail.quantity} -{' '}
                                                            {new Intl.NumberFormat('vi-VN').format(detail.totalPrice)}VND
                                                        </li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell>
                                                {order.orderVouchers.length > 0 ? (
                                                    <ul>
                                                        {order.orderVouchers.map((voucher) => (
                                                            <li key={voucher.id}>
                                                                {voucher.code} ({voucher.discountPercentage}% off)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    'No vouchers'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('vi-VN').format(order.totalPrice)}VND
                                            </TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleCancelClick(order.id)}
                                                    disabled={loading || !(order.status === Status.Pending || order.status === Status.Processing)}
                                                >
                                                    Cancel
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <ConfirmModal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={cancelOrder}
                        title="Cancel Order"
                        message="Are you sure you want to cancel this order?"
                    />
                </div>
            </main>
        </ProfileLayout>
    );
};

export default Order;
