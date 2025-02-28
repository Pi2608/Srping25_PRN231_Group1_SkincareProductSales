import React, { useState } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import "./VoucherMng.css";

const vouchers = [
  { id: 1, code: "DISCOUNT10", discountPercentage: 10, expiredDate: "2024-03-10" },
  { id: 2, code: "SUMMER20", discountPercentage: 20, expiredDate: "2024-06-15" },
  { id: 3, code: "WELCOME5", discountPercentage: 5, expiredDate: "2024-04-01" },
  { id: 4, code: "FREESHIP", discountPercentage: 0, expiredDate: "2024-05-20" },
];

const VoucherMng = () => {
  const [search, setSearch] = useState("");
  const [voucherList, setVoucherList] = useState(vouchers);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredVouchers = voucherList.filter((voucher) =>
    voucher.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayoutComponent>
        <div id="voucher_mng">
            <div className="table-container">
                <input
                    type="text"
                    placeholder="Search vouchers by code"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Voucher ID</th>
                        <th>Code</th>
                        <th>Discount %</th>
                        <th>Expired Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredVouchers.map((voucher) => (
                        <tr key={voucher.id}>
                        <td>{voucher.id}</td>
                        <td>{voucher.code}</td>
                        <td>{voucher.discountPercentage}%</td>
                        <td>{voucher.expiredDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </DashboardLayoutComponent>
  );
};

export default VoucherMng;
