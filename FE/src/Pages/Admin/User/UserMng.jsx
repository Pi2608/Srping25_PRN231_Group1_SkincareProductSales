import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import CreateModal from "../../../Components/CreateModal/CreateModal";
import EditModal from '../../../Components/EditModal/EditModal'
import ApiGateway from "../../../Api/ApiGateway";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "./UserMng.css";

const UserMng = () => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [thisUser, setThisUser] = useState();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  },[])

  const fetchUsers = async () => {
    const response = await ApiGateway.getAllUsers();
    setUserList(response);  
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditUser = async (newUser) => {
    try {
      await ApiGateway.updateUser(newUser);
      fetchUsers();
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  }

  const orderUser = (orderBy) => {
    const sortedUsers = [...userList].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    });
    setUserList(sortedUsers);
  };

  return (
    <DashboardLayoutComponent>
      <div id="user_mng">
        <div className="table-container">
          <div className="action-bar">
            <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={handleSearch}
                className="search-bar"
            />
            <button className="search"><SearchIcon/>Search</button>
            <button className="add" onClick={() => setOpenCreateModal(true)}><PersonAddIcon/> Add user</button>
          </div>
            <table className="product-table">
                <thead>
                  <tr>
                      <th>No</th>
                      <th className="active" onClick={() => orderUser("account")}>User Name</th>
                      <th onClick={() => orderUser("email")}>Email</th>
                      <th onClick={() => orderUser("address")}>Address</th>
                      <th onClick={() => orderUser("roleId")}>Role</th>
                      <th onClick={() => orderUser("status")}>Status</th>
                  </tr>
                </thead>
                <tbody>
                {userList.map((user, index) => (
                  <tr key={user.id} onClick={() => {setOpenEditModal(true); setThisUser(user)}}>
                    <td>{index + 1}</td>
                    <td>{user.account}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.roleId == "f5e71b77-2d89-42e3-bb20-6ac071226c93" ? "Customer" : "Admin"}</td>
                    <td style={user.status ? {color: "#ff4040"} : {color: "#46FF40"}}>
                      {user.status ? "Banned" : "Active"}
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
      </div>
    </DashboardLayoutComponent>
  );
};

export default UserMng;
