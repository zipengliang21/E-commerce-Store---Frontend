import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CardID from "../plugin/CardID";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../plugin/Context";
import { AddToWishlist } from "../plugin/AddToWishlist";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const [qtyValue, setQtyValue] = useState(1);

  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSize, setSelectedSize] = useState({});

  const [cartCount, setCartCount] = useContext(CartContext);

  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cartID = CardID();

  const navigate = useNavigate();

  const handleColorButtonClick = (e, productId, colorName) => {
    setSelectedColors(prevSelectedColors => ({
      ...prevSelectedColors,
      [productId]: colorName,
    }));
  };

  const handleSizeButtonClick = (e, productId, sizeName) => {
    setSelectedSize(prevSelectedSize => ({
      ...prevSelectedSize,
      [productId]: sizeName,
    }));
  };

  const handleQtyChange = (event, productId) => {
    setQtyValue(event.target.value);
  };

  console.log(selectedColors);
  console.log(selectedSize);

  useEffect(() => {
    const fetchProducts = () => {
      apiInstance
        .get("products/")
        .then(response => {
          setProducts(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    };

    const fetchCategory = () => {
      apiInstance
        .get("category/")
        .then(response => {
          setCategory(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching category:", error);
        });
    };

    fetchProducts();
    fetchCategory();
  }, []);

  const handleAddToCart = async (productId, price, shippingAmount) => {
    const formData = new FormData();

    formData.append("product_id", productId);
    formData.append("user_id", userData?.user_id);
    formData.append("qty", qtyValue);
    formData.append("price", price);
    formData.append("shipping_amount", shippingAmount);
    formData.append("country", currentAddress.country);
    formData.append("size", selectedSize[productId]);
    formData.append("color", selectedColors[productId]);
    formData.append("cart_id", cartID);

    let response = await apiInstance.post(`cart-view/`, formData);
    console.log(response.data);

    Toast.fire({
      icon: "success",
      title: response.data.message,
    });

    const url = userData?.user_id
      ? `cart-list/${cartID}/${userData?.user_id}/`
      : `cart-list/${cartID}/`;
    response = await apiInstance.get(url);

    setCartCount(response.data.length);
  };

  const handleAddToWishlist = async product_id => {
    try {
      await AddToWishlist(product_id, userData?.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="mt-4">
        <div className="container">
          <div className="text-center">
            <div>
              {category.length > 0 ? (
                <h5 className="d-flex px-2 mb-3">Category</h5>
              ) : (
                ""
              )}
              <div className="row">
                {category?.map((c, index) => (
                  <div
                    className="col-lg-2"
                    key={index}
                    onClick={() => navigate(`/search?query=${c.title}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={c.image}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt={c.title}
                    />
                    <h6>{c.title}</h6>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3">
              {products.length > 0 ? (
                <h5 className="d-flex px-2 mb-3">Products</h5>
              ) : (
                ""
              )}
              <div className="row">
                {products?.map((p, index) => (
                  <div className="col-lg-4 col-md-12 mb-4" key={index}>
                    <div className="card">
                      <div
                        className="bg-image hover-zoom ripple"
                        data-mdb-ripple-color="light"
                      >
                        <Link to={`/detail/${p.pid}/`}>
                          <img
                            src={p.image}
                            className="w-100"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      </div>
                      <div className="card-body">
                        <Link to={`/detail/${p.pid}/`} className="text-reset">
                          <h5 className="card-title mb-3">
                            {p.title.length > 25
                              ? `${p.title.slice(0, 25)}...`
                              : p.title}
                          </h5>
                        </Link>
                        <div className="text-reset">
                          <p>{p.category?.title}</p>
                        </div>
                        <div className="d-flex justify-content-center">
                          <h6 className="mb-3">${p.price}</h6>
                          <h6 className="mb-3 text-muted ms-2">
                            <strike>${p.old_price}</strike>
                          </h6>
                        </div>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary me-1 mb-1 dropdown-toggle"
                            type="button"
                            id="dropdownMenuClickable"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="false"
                            aria-expanded="false"
                          >
                            Variation
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuClickable"
                          >
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Quantity</b>
                              </li>

                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                <li>
                                  <input
                                    className="form-control"
                                    value={qtyValue}
                                    onChange={e => handleQtyChange(e, p.id)}
                                    type="number"
                                  />
                                </li>
                              </div>
                            </div>

                            {p.size?.length > 0 && (
                              <div className="d-flex flex-column">
                                <li className="p-1">
                                  <b>Size</b>:{" "}
                                  {selectedSize[p.id] || "Select a size"}
                                </li>

                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {p.size?.map((size, index) => (
                                    <li key={index}>
                                      <button
                                        onClick={e =>
                                          handleSizeButtonClick(e, p.id, size.name)
                                        }
                                        className="btn btn-secondary btn-sm me-2 mb-1"
                                      >
                                        {size.name}
                                      </button>
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}
                            {p.color?.length > 0 && (
                              <div className="d-flex flex-column mt-3">
                                <li className="p-1">
                                  <b>Color</b>:{" "}
                                  {selectedColors[p.id] || "Select a color"}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {p?.color?.map((color, index) => (
                                    <li key={index}>
                                      <button
                                        className="btn btn-sm me-2 mb-1 p-3"
                                        style={{
                                          backgroundColor: `${color.color_code}`,
                                        }}
                                        onClick={e =>
                                          handleColorButtonClick(e, p.id, color.name)
                                        }
                                      />
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="d-flex mt-3 p-1">
                              <button
                                type="button"
                                className="btn btn-primary me-1 mb-1"
                                onClick={() =>
                                  handleAddToCart(p.id, p.price, p.shipping_amount)
                                }
                              >
                                <i className="fas fa-shopping-cart" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger px-3 me-1 mb-1 ms-2"
                              >
                                <i className="fas fa-heart" />
                              </button>
                            </div>
                          </ul>
                          <button
                            type="button"
                            onClick={() => handleAddToWishlist(p.id)}
                            className="btn btn-danger px-3 me-1 ms-2"
                          >
                            <i className="fas fa-heart" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Products;
