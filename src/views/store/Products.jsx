import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSize, setSelectedSize] = useState({});

  const handleColorButtonClick = (e, productId, colorName) => {
    setColorValue(colorName);
    setSelectedProduct(productId);

    setSelectedColors(prevSelectedColors => ({
      ...prevSelectedColors,
      [productId]: colorName,
    }));
  };

  const handleSizeButtonClick = (e, productId, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(productId);

    setSelectedSize(prevSelectedSize => ({
      ...prevSelectedSize,
      [productId]: sizeName,
    }));
  };

  const handleQtyChange = (event, productId) => {
    setQtyValue(event.target.value);
    setSelectedProduct(productId);
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

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <div className="text-center">
            <div className="row">
              {products?.map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4" key={index}>
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      <Link to={`/detail/${p.slug}/`}>
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
                      <Link to={`/detail/${p.slug}/`} className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
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
                                <b>Size</b>: {selectedSize[p.id] || "Select a size"}
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
            <div className="row">
              {category?.map((c, index) => (
                <div className="col-lg-2" key={index}>
                  <img
                    src={c.image}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                  <h6>{c.title}</h6>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Products;
