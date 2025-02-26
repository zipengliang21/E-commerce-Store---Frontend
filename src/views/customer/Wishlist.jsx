import React, { useState, useEffect } from "react";
import Sidebar from "./Siderbar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";
import { AddToWishlist } from "../plugin/AddToWishlist";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const axios = apiInstance;
  const userData = UserData();

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`customer/wishlist/${userData?.user_id}/`);
      setWishlist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userData?.user_id]);

  console.log(wishlist);

  const handleAddToWishlist = async product_id => {
    try {
      await AddToWishlist(product_id, userData?.user_id);
      fetchWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          <section className="">
            <div className="row">
              <Sidebar />
              <div className="col-lg-9 mt-1">
                <section className="">
                  <main className="mb-5" style={{}}>
                    <div className="container">
                      {/* Section: Summary */}
                      <section className="">
                        <div className="row">
                          <h3 className="mb-3">
                            {" "}
                            <i className="fas fa-heart text-danger" /> Wishlist{" "}
                          </h3>
                          {wishlist.map((w, index) => (
                            <div className="col-lg-4 col-md-12 mb-4" key={index}>
                              <div className="card">
                                <div
                                  className="bg-image hover-zoom ripple"
                                  data-mdb-ripple-color="light"
                                >
                                  <img
                                    src={w.product.image}
                                    className="w-100"
                                    style={{
                                      width: "100%",
                                      height: "250px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="card-body">
                                  <a href="" className="text-reset">
                                    <h5 className="card-title mb-3 ">
                                      {w.product.title}
                                    </h5>
                                  </a>
                                  <a href="" className="text-reset">
                                    <p>{w.product?.category.title}</p>
                                  </a>
                                  <div className="d-flex">
                                    <h6 className="mb-3">${w.product.price}</h6>
                                    <h6 className="mb-3 text-muted ms-2">
                                      <strike>${w.product.old_price}</strike>
                                    </h6>
                                  </div>
                                  <button
                                    onClick={() => handleAddToWishlist(w.product.id)}
                                    type="button"
                                    className="btn btn-danger px-3 me-1 mb-1"
                                  >
                                    <i className="fas fa-heart" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {wishlist.length < 1 && (
                            <h6 className="container">Your wishlist is Empty </h6>
                          )}
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

export default Wishlist;
