import React from "react";
import {
  Boxes,
  DollarSign,
  Layers,
  Mic2,
  PackageSearch,
  Star,
  Users2,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <>
      <NavLink to="/admin/dashboard">
        <div className="p-2">
          <LayoutDashboard />
          <p>Dashboard</p>
        </div>
      </NavLink>
      <NavLink to="/admin/products">
        <div className="p-2">
          <PackageSearch />
          <p>Products</p>
        </div>
      </NavLink>
      <NavLink to="/admin/orders">
        <div className="p-2">
          <Boxes />
          <p>Orders</p>
        </div>
      </NavLink>
      <NavLink to="/admin/users">
        <div className="p-2">
          <Users2 />
          <p>Users</p>
        </div>
      </NavLink>
      <NavLink to="/admin/allreviews">
        <div className="p-2">
          <Star />
          <p>Reviews</p>
        </div>
      </NavLink>
      <NavLink to="/admin/bannerslist">
        <div className="p-2">
          <Layers />
          <p>Banners</p>
        </div>
      </NavLink>
      <NavLink to="/admin/announcementlist">
        <div className="p-2">
          <Mic2 />
          <p>News</p>
        </div>
      </NavLink>
      <NavLink to="/admin/allwithdraws">
        <div className="p-2">
          <DollarSign />
          <p>Transactions</p>
        </div>
      </NavLink>
    </>
  );
};

export default AdminSidebar;
