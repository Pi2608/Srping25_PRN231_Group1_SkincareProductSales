import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import Modal from "../../../Components/Modal/Modal";
import ApiGateway from "../../../Api/ApiGateway";
import "./UserMng.css";

const users = [
  { id: 1, account: "John Doe", email: "john@example.com", roleId: "Admin", isDeleted: true },
  { id: 2, account: "Jane Smith", email: "jane@example.com", roleId: "User", isDeleted: true },
  { id: 3, account: "Alice Brown", email: "alice@example.com", roleId: "User", isDeleted: false },
  { id: 4, account: "Bob White", email: "bob@example.com", roleId: "Admin", isDeleted: true },
];

const UserMng = () => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(null);
  const [thisUser, setThisUser] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  },[])

  const fetchUsers = async () => {
    const response = await ApiGateway.getAllUsers();
    setUserList(response);
    console.log(response);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // const toggleStatus = (id) => {
  //   setUserList((prevList) =>
  //     prevList.map((user) =>
  //       user.id === id ? { ...user, status: !user.status } : user
  //     )
  //   );
  // };

  // const filteredUsers = userList.filter((user) =>
  //   user.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <DashboardLayoutComponent>
        <div id="user_mng">
            <div className="table-container">
                <input
                    type="text"
                    placeholder="Search users"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                />
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
                        <tr key={user.id} onClick={() => {setOpenPopup(true); setThisUser(user)}}>
                          <td>{index + 1}</td>
                          <td>{user.account}</td>
                          <td>{user.email}</td>
                          <td>{user.address}</td>
                          <td>{user.roleId == "f5e71b77-2d89-42e3-bb20-6ac071226c93" ? "Customer" : "Admin"}</td>
                          <td style={user.status ? {color: "#ff4040"} : {color: "#46FF40"}}>
                              {/* <label className="switch">
                              <input
                                  type="checkbox"
                                  checked={user.status}
                                  onChange={() => toggleStatus(user.id)}
                              />
                              <span className="slider"></span>
                              </label> */}
                              {user.status ? "Banned" : "Active"}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          {openPopup && 
              <Modal onClose={() => {setOpenPopup(false); setThisUser()}}>
                <div className="user-info">
                  <h1>This is {thisUser.account}</h1>
                </div>
              </Modal>
          }
        </div>
    </DashboardLayoutComponent>
  );
};

export default UserMng;
