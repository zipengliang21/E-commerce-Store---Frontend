import React, { useState, useEffect } from "react";
import Sidebar from "./Siderbar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import Swal from "sweetalert2";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const axios = apiInstance;
  const userData = UserData();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const fetchNoti = () => {
    axios.get(`customer/notification/${userData?.user_id}/`).then(res => {
      setNotifications(res.data);
      if (notifications) {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchNoti();
  }, []);

  const markNotiAsSeen = notiId => {
    axios.get(`customer/notification/${userData?.user_id}/${notiId}/`).then(res => {
      console.log(res.data);
    });
    fetchNoti();
    Toast.fire({
      icon: "success",
      title: "Notification marked as seen",
    });
  };

  return (
    <div>
      <main className="mt-5" style={{ marginBottom: 200 }}>
        <div className="container">
          <section className="">
            <div className="row">
              <Sidebar />
              <div className="col-lg-9 mt-1">
                <section className="">
                  <main className="mb-5" style={{}}>
                    <div className="container px-4">
                      {/* Section: Summary */}
                      <section className="">
                        <h3 className="mb-3">
                          {" "}
                          <i className="fas fa-bell" /> Notifications{" "}
                        </h3>
                        <div className="list-group">
                          {notifications?.map((noti, index) => (
                            <a
                              href="#"
                              className="list-group-item list-group-item-action"
                              aria-current="true"
                              key={index}
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">New Order!</h5>
                                <small>
                                  {moment(noti.date).format("MM-DD-YYYY")}
                                </small>
                              </div>
                              <p className="mb-1">
                                Your order #{noti?.order?.oid} was successfull
                              </p>
                              <small className="">
                                Total: ${noti?.order?.total}
                              </small>{" "}
                              <br />
                              <small className="">
                                Shipping: ${noti?.order?.shipping_amount}
                              </small>{" "}
                              <br />
                              <small className="">
                                Tax: ${noti?.order?.tax_fee}
                              </small>{" "}
                              <br />
                              <small className="">
                                Service Fee: ${noti?.order?.service_fee}
                              </small>{" "}
                              <br />
                              <button
                                onClick={() => markNotiAsSeen(noti.id)}
                                className="btn btn-primary mt-2"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </a>
                          ))}

                          {notifications.length < 1 && <h6>No notifications yet</h6>}
                        </div>
                      </section>
                      {/* Section: Summary */}
                      {/* Section: MSC */}
                      {/* Section: MSC */}
                    </div>
                    {/* Container for demo purpose */}
                  </main>
                </section>
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </div>
  );
}

export default Notifications;
