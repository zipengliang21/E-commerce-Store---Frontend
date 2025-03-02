import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";

function VendorOrders() {
  const [orders, setOrders] = useState(null);

  const axios = apiInstance;
  const userData = UserData();

  if (UserData()?.vendor_id === 0) {
    window.location.href = "/vendor/register/";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`vendor/orders/${userData?.vendor_id}/`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterOrder = async filter => {
    try {
      const response = await axios.get(
        `vendor/orders/filter/${userData?.vendor_id}/?filter=${filter}`,
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main">
          <div className="mb-3 mt-3" style={{ marginBottom: 300 }}>
            <div>
              <h4>
                <i className="bi bi-cart-check-fill"></i> All Orders{" "}
              </h4>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                  type="button"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                  aria-expanded="false"
                >
                  Filter <i className="fas fa-sliders"></i>
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("paid")}
                    >
                      Payment Status: Paid
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("pending")}
                    >
                      Payment Status: Pending
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("processing")}
                    >
                      Payment Status: Processing
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("cancelled")}
                    >
                      Payment Status: Cancelled
                    </a>
                  </li>
                  <hr />
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("latest")}
                    >
                      Date: Latest
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("oldest")}
                    >
                      Date: Oldest
                    </a>
                  </li>
                  <hr />
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("Pending")}
                    >
                      Order Status: Pending
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("Fulfilled")}
                    >
                      Order Status: Fulfilled
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrder("Cancelled")}
                    >
                      Order Status: Cancelled
                    </a>
                  </li>
                </ul>
              </div>

              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((o, index) => (
                    <tr key={index}>
                      <th scope="row">#{o.oid}</th>
                      <td>{o.full_name}</td>
                      <td>{o.payment_status}</td>
                      <td>{o.order_status}</td>
                      <td>{moment(o.date).format("MM/DD/YYYY")}</td>
                      <td>
                        <Link
                          to={`/vendor/orders/${o.oid}/`}
                          className="btn btn-primary mb-1"
                        >
                          <i className="fas fa-eye" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders < 1 && <h5 className="mt-4 p-3">No orders yet</h5>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorOrders;
