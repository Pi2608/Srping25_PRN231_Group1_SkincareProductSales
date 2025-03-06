import React, { useState, useEffect } from 'react';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import ApiGateway from '../../../../Api/ApiGateway';
import { useAuth } from '../../../../AuthContext/AuthContext';
import './Voucher.css';

const mockVouchers = [
    {
        id: '1',
        code: 'HAVEN10',
        discountPercentage: 10,
        expiredDate: '2025-06-30'
    },
    {
        id: '2',
        code: 'SUMMER20',
        discountPercentage: 20,
        expiredDate: '2024-03-01'
    },
    {
        id: '3',
        code: 'WELCOME5',
        discountPercentage: 5,
        expiredDate: '2024-12-31'
    }
];

const Voucher = () => {
    const { user } = useAuth();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            fetchVouchers();
        } else {
            setVouchers(mockVouchers);
        }
    }, [user]);

    const fetchVouchers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await ApiGateway.getVouchersByUserId(user.id);
            setVouchers(response);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setError('Failed to fetch vouchers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isExpired = (date) => new Date(date) < new Date();

    return (
        <ProfileLayout>
            <main id="vouchers">
                <h1>My Vouchers</h1>
                <div className="content">
                    {loading ? (
                        <p>Loading vouchers...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : vouchers.length === 0 ? (
                        <p>No vouchers found.</p>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell sx={{ textAlign: 'left' }}>Code</TableCell>
                                        <TableCell>Discount</TableCell>
                                        <TableCell>Expiration Date</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vouchers.map((voucher, index) => (
                                        <TableRow key={voucher.id}>
                                            <TableCell>{index+1}</TableCell>
                                            <TableCell sx={{ textAlign: 'left' }}>{voucher.code}</TableCell>
                                            <TableCell>{voucher.discountPercentage}%</TableCell>
                                            <TableCell>{new Date(voucher.expiredDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {isExpired(voucher.expiredDate) ? (
                                                    <Typography color="error">Expired</Typography>
                                                ) : (
                                                    <Typography color="green">Active</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </main>
        </ProfileLayout>
    );
};

export default Voucher;
