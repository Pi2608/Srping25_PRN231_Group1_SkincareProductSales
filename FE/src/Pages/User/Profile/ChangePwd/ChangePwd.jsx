import React, { useState } from 'react';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import ConfirmModal from '../../../../Components/ConfirmModal/ConfirmModal.jsx';
import ApiGateway from '../../../../Api/ApiGateway';
import { useAuth } from '../../../../AuthContext/AuthContext';
import TextField from '@mui/material/TextField';
import './ChangePwd.css';

const ChangePwd = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
    
        if (!user || !user.id) {
            setError('User not found. Please log in again.');
            return;
        }
    
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required.');
            return;
        }
    
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }
    
        setIsModalOpen(true);
    };
    
    const confirmPasswordChange = async () => {
        setLoading(true);
        try {
            await ApiGateway.changePassword(user.id, formData.currentPassword, formData.newPassword);
            alert('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <ProfileLayout>
            <main id="change-password">
                <h1>Change Password</h1>
                <div className="content">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <TextField
                            name="currentPassword"
                            label="Current Password"
                            type="password"
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={formData.currentPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            name="newPassword"
                            label="New Password"
                            type="password"
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                        <ConfirmModal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={confirmPasswordChange}
                            title="Confirm Password Change"
                            message="Are you sure you want to change your password?"
                        />
                    </form>
                </div>
            </main>
        </ProfileLayout>
    );
};

export default ChangePwd;
