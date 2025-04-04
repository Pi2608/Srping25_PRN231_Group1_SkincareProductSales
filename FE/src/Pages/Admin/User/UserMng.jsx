import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import CreateModal from "../../../Components/CreateModal/CreateModal";
import EditModal from '../../../Components/EditModal/EditModal'
import ConfirmModal from "../../../Components/ConfirmModal/ConfirmModal";
import ApiGateway from "../../../Api/ApiGateway";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import "./UserMng.css";

const UserMng = () => {
  const [search, setSearch] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("account"); // Default search by username
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [thisUser, setThisUser] = useState();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  },[])

  const fetchUsers = async () => {
    const response = await ApiGateway.getAllUsers();
    setUserList(response);
    setFilteredUsers(response); // Initialize filtered users with all users
  }

  const createUser = async (newUser) => {
    try {
      const response = await ApiGateway.createUser(newUser);
      if (response) {
        fetchUsers();
      }      
      return response;
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  }

  const handleEditUser = async (userId, user) => {
    try {
      await ApiGateway.editUser(userId, user);
      fetchUsers();
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await ApiGateway.deleteUser(userId);
      fetchUsers();
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  const handleRestoredUser = async (userId) => {
    try {
      await ApiGateway.restoreUser(userId);
      fetchUsers();
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchAttributeChange = (e) => {
    setSearchAttribute(e.target.value);
  };

  const performSearch = () => {
    if (!search.trim()) {
      setFilteredUsers(userList);
      return;
    }
    
    const searchValue = search.toLowerCase();
    
    const filtered = userList.filter(user => {
      const attributeValue = user[searchAttribute];
      
      if (searchAttribute === "roleId") {
        const roleText = user.roleId === "f5e71b77-2d89-42e3-bb20-6ac071226c93" ? "customer" : "admin";
        return roleText.toLowerCase().includes(searchValue);
      }
      
      if (searchAttribute === "isDeleted") {
        const isDeletedText = user.isDeleted ? "banned" : "active";
        return isDeletedText.toLowerCase().includes(searchValue);
      }
      
      return attributeValue && attributeValue.toString().toLowerCase().includes(searchValue);
    });
    
    setFilteredUsers(filtered);
  };

  const orderUser = (orderBy) => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <DashboardLayoutComponent>
      <div id="user_mng">
        <div className="table-container">
          <div className="action-bar">
            <div className="search-container">
              <FormControl className="search-attribute">
                <Select
                  value={searchAttribute}
                  onChange={handleSearchAttributeChange}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="account">Username</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="roleId">Role</MenuItem>
                </Select>
              </FormControl>
              <input
                type="text"
                placeholder={searchAttribute ? `Search by user name` : `Search by ${searchAttribute}`}
                value={search}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                className="search-bar"
              />
              <button className="search" onClick={performSearch}>
                <SearchIcon/>Search
              </button>
            </div>
            <button className="add" onClick={() => setOpenCreateModal(true)}>
              <PersonAddIcon/> Add user
            </button>
          </div>
            <table className="product-table">
                <thead>
                  <tr>
                      <th onClick={() => orderUser("createdAt")}>No</th>
                      <th className="active" onClick={() => orderUser("account")}>User Name</th>
                      <th onClick={() => orderUser("email")}>Email</th>
                      <th onClick={() => orderUser("address")}>Address</th>
                      <th onClick={() => orderUser("roleId")}>Role</th>
                      <th onClick={() => orderUser("isDeleted")}>Status</th>
                      <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} onClick={() => {setOpenEditModal(true); setThisUser(user)}}>
                    <td>{index + 1}</td>
                    <td>{user.account}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.roleId == "f5e71b77-2d89-42e3-bb20-6ac071226c93" ? "Customer" : "Admin"}</td>
                    <td style={user.isDeleted ? {color: "#ff4040"} : {color: "#46FF40"}}>
                      {user.isDeleted ? "Banned" : "Active"}
                    </td>
                    <td>
                      <Button 
                        variant="outlined" 
                        color={user.isDeleted ? "info" : "error" }
                        disabled={user.roleId != "f5e71b77-2d89-42e3-bb20-6ac071226c93"}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setThisUser(user);
                          setOpenDeleteModal(true);
                        }}>{user.isDeleted ? "UnBan" : "Ban"}</Button>
                    </td>
                  </tr>
                ))}
                </tbody>
            </table>
        </div>
        {openEditModal && (
          <EditModal 
            type="User"
            open={openEditModal}
            object={thisUser}
            onEdit={handleEditUser} 
            onClose={() => setOpenEditModal(false)} 
          />
        )}
        <CreateModal 
          type="User"
          open={openCreateModal}
          onCreate={createUser}
          onClose={() => setOpenCreateModal(false)} 
        />
        <ConfirmModal 
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={() => thisUser?.isDeleted ? handleRestoredUser(thisUser?.id) : handleDeleteUser(thisUser?.id)}
          title="Delete User"
          message={`Are you sure you want to ${thisUser?.isDeleted ? 'unban' : 'ban'} : ${thisUser?.account}?`}
        />
      </div>
    </DashboardLayoutComponent>
  );
};

export default UserMng;