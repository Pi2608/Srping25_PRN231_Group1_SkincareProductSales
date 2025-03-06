import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import EditModal from '../../../Components/EditModal/EditModal'
import ApiGateway from "../../../Api/ApiGateway";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "./UserMng.css";

const UserMng = () => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [thisUser, setThisUser] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  },[])

  const fetchUsers = async () => {
    const response = await ApiGateway.getAllUsers();
    setUserList(response);  
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditUser = async (newUser) => {}

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
            <button className="add"><PersonAddIcon/> Add user</button>
          </div>
            <table className="product-table">
                <thead>
                  <tr>
                      <th>No</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Status</th>
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
            object={thisUser}
            onEdit={handleEditUser} 
            onClose={() => setOpenEditModal(false)} 
          />
        )}
      </div>
    </DashboardLayoutComponent>
  );
};

export default UserMng;
