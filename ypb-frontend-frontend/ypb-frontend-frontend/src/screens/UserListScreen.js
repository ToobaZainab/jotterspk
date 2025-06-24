import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Spinner from "../components/Spinner";
import { User, UserCheck, UserCog2, Users } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { backUrl } from "../helpers/Url";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [allUsers, setAllUsers] = useState([]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${backUrl()}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setAllUsers(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${backUrl()}/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const [userInput, setUserInput] = useState("");
  const filteredData = filterData(allUsers, userInput);

  function filterData(allUsers, userInput) {
    return allUsers?.filter((user) => {
      return (
        user?.name.toLowerCase().includes(userInput.toLowerCase()) ||
        user?._id.toLowerCase().includes(userInput.toLowerCase())
      );
    });
  }

  const adminUsers = allUsers.filter((user) => user.isAdmin === true);
  const ResellerUsers = allUsers.filter((user) => user.isReseller === true);
  const customers = allUsers.filter(
    (user) => user.isAdmin !== true && user.isReseller !== true
  );

  return (
    <>
      <Helmet>
        <title>All Users | Jotters Pk</title>
      </Helmet>
      {loadingDelete && <LoadingBox></LoadingBox>}
      <section className="admin_wrapper p-3">
        <div className="admin_sidebar bg-white p-2">
          <AdminSidebar />
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="admin_content bg-white">
            <div className="stat_card_grid mt-1 px-3">
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <Users size={24} strokeWidth={1.25} /> Total Users
                    </p>
                    <br />
                    <h4>{allUsers.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <UserCheck size={24} strokeWidth={1.25} /> No. of Admins
                    </p>
                    <br />
                    <h4>{adminUsers.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <UserCog2 size={24} strokeWidth={1.25} /> No. of Resellers
                    </p>
                    <br />
                    <h4>{ResellerUsers.length}</h4>
                  </div>
                </div>
              </div>
              <div className="stat_card bg-info p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat_card_text">
                    <p>
                      <User size={24} strokeWidth={1.25} /> Other
                      Users/Customers
                    </p>
                    <br />
                    <h4>{customers.length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid d-flex flex-wrap align-items-center gap-2 justify-content-between mt-2">
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="addon-wrapping">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-light"
                  placeholder="Type to Search"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive p-3">
              {filteredData.length === 0 ? (
                <h4 className="mt-3">No Record Found</h4>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {filteredData.map((user) => (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.isAdmin && user.isReseller ? (
                            <span className="badge text-bg-info">
                              Admin/Reseller
                            </span>
                          ) : user.isAdmin ? (
                            <span className="badge text-bg-success">Admin</span>
                          ) : user.isReseller ? (
                            <span className="badge text-bg-warning">
                              Reseller
                            </span>
                          ) : (
                            <span className="badge text-bg-danger">User</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => navigate(`/admin/user/${user._id}`)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          &nbsp;
                          <button
                            disabled={loadingDelete}
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteHandler(user)}
                          >
                            {loadingDelete ? (
                              <Spinner></Spinner>
                            ) : (
                              <i className="bi bi-trash3-fill"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
