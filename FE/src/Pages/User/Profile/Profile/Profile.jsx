import React, { useState, useEffect } from 'react';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import ApiGateway from '../../../../Api/ApiGateway';
import ConfirmModal from '../../../../Components/ConfirmModal/ConfirmModal';
import { useAuth } from '../../../../AuthContext/AuthContext';
import TextField from '@mui/material/TextField';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    account: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize form data when user is available
  useEffect(() => {
    if (!user) return;
    setFormData({
      account: user.account || 'User',
      email: user.email || 'user@gmail.com',
      address: user.address || 'SomeWhere, Ho Chi Minh City'
    });
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      await ApiGateway.updateProfile(user.id, formData);
      
      setUser(prevUser => ({
        ...prevUser,
        ...formData
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setError('User not found. Please log in again.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <ProfileLayout>
      <main id="profile">
        <h1>Profile</h1>
        <div className="content">
          <form className="table-container" onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>User Name</td>
                  <td>
                    <TextField
                      name="account"
                      label="User Name"
                      type="text"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={formData.account}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    <TextField
                      name="email"
                      label="Email"
                      type="text"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>
                    <TextField
                      name="address"
                      label="Address"
                      type="text"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
            <ConfirmModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={updateProfile}
              title="Confirm Profile Update"
              message="Are you sure you want to update your profile?"
            />
          </form>
        </div>
      </main>
    </ProfileLayout>
  );
};

export default Profile;
