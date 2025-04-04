import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ApiGateway from "../../../Api/ApiGateway";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VoucherMng.css";

const VoucherMng = () => {
  const [search, setSearch] = useState("");
  const [voucherList, setVoucherList] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  
  useEffect(() => {
    fetchVoucher();
  }, []);

  const fetchVoucher = async () => {
    try {
      const response = await ApiGateway.getAllVouchers();
      setVoucherList(response);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearch = async () => {
    try {
      const data = await ApiGateway.searchVouchers(search);
      setVoucherList(data);
      console.log(data)
    } catch (error) {
        console.error("Error fetching products:", error);
    }
  }

  const handleUpdateClick = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenUpdate(true);
  };

  const handleDeleteClick = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenDelete(true);
  };

  const handleUpdate = async () => {
    try {
      const voucher = {
        code: selectedVoucher.code,
        discountPercentage: selectedVoucher.discountPercentage,
        expiredDate: selectedVoucher.expiredDate,
        minimumOrderTotalPrice: selectedVoucher.minimumOrderTotalPrice
      }
      console.log(voucher)
      await ApiGateway.axiosInstance.post(`/Voucher/UpdateVoucher?id=${selectedVoucher.id}`, voucher);
      toast.success("Voucher updated successfully");
      setOpenUpdate(false);
      fetchVoucher();
    } catch (error) {
      toast.error("Failed to update voucher");
    }
  };

  const handleDelete = async () => {
    try {
      await ApiGateway.axiosInstance.delete(`/Voucher/DeleteVoucher/${selectedVoucher.id}`);
      toast.success("Voucher deleted successfully");
      setOpenDelete(false);
      fetchVoucher();
    } catch (error) {
      toast.error("Failed to delete voucher");
    }
  };

  const filteredVouchers = voucherList.filter((voucher) =>
    voucher.code.toLowerCase()
  );

  return (
    <DashboardLayoutComponent>
      <ToastContainer/>
      <div id="voucher_mng">
        <div className="table-container">
          <div className="action-bar">
            <input
              type="text"
              placeholder="Search vouchers by code"
              value={search}
              onChange={(e) => handleSearchChange(e)}
              className="search-bar"
            />
            <button className="search" onClick={handleSearch}><SearchIcon />Search</button>
            <button className="add"><AddIcon /> Add Voucher</button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Discount %</th>
                <th>Expired Date</th>
                <th>Minimum Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{voucher.code}</td>
                  <td>{voucher.discountPercentage}%</td>
                  <td>{new Date(voucher.expiredDate).toLocaleDateString()}</td>
                  <td>{new Intl.NumberFormat('vi-VN').format(voucher.minimumOrderTotalPrice)} VND</td>
                  <td>
                    <div className="voucher-action">
                      <Button variant="outlined" onClick={() => handleUpdateClick(voucher)} className="edit">Edit</Button>
                      <Button variant="outlined" onClick={() => handleDeleteClick(voucher)} className="delete">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogTitle>Update Voucher</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Code" value={selectedVoucher?.code || ''} onChange={(e) => setSelectedVoucher({ ...selectedVoucher, code: e.target.value })} />
          <TextField fullWidth margin="dense" label="Discount %" type="number" value={selectedVoucher?.discountPercentage || ''} onChange={(e) => setSelectedVoucher({ ...selectedVoucher, discountPercentage: e.target.value })} />
          <TextField fullWidth margin="dense" label="Expired Date" type="date" value={selectedVoucher?.expiredDate?.split('T')[0] || ''} onChange={(e) => setSelectedVoucher({ ...selectedVoucher, expiredDate: e.target.value })} />
          <TextField fullWidth margin="dense" label="Minimum Order Price" type="number" value={selectedVoucher?.minimumOrderTotalPrice || ''} onChange={(e) => setSelectedVoucher({ ...selectedVoucher, minimumOrderTotalPrice: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this voucher?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutComponent>
  );
};

export default VoucherMng;
