import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CardID from "../plugin/CardID";
import moment from "moment";

import { AddToWishlist } from "../plugin/AddToWishlist";
import { CartContext } from "../plugin/Context";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [specification, setSpecification] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);
  const [vendor, setVendor] = useState([]);

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);

  const [createReview, setCreateReview] = useState({
    user_id: 0,
    product_id: product?.id,
    review: "",
    rating: 0,
  });
  const [reviews, setReviews] = useState([]);

  const [cartCount, setCartCount] = useContext(CartContext);

  const param = useParams();
  const currentAddress = GetCurrentAddress();
  const userData = UserData();

  const cardId = CardID();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await apiInstance.get(`products/${param.slug}`);
        setProduct(response.data);
        setSpecification(response.data.specification);
        setGallery(response.data.gallery);
        setColors(response.data.color);
        setSize(response.data.size);
        setVendor(response.data.vendor);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductDetail();
  }, []);

  const handleColorButtonClick = event => {
    const colorNameInput = event.target
      .closest(".color_button")
      .parentNode.querySelector(".color_name");
    setColorValue(colorNameInput.value);
  };

  const handleSizeButtonClick = event => {
    const sizeNameInput = event.target
      .closest(".size_button")
      .parentNode.querySelector(".size_name");
    setSizeValue(sizeNameInput.value);
  };

  const handleQuantityChange = event => {
    setQtyValue(event.target.value);
  };

  const handleAddToCart = async () => {
    try {
      const formData = new FormData();

      formData.append("user_id", userData?.user_id);
      formData.append("product_id", product.id);
      formData.append("qty", qtyValue);
      formData.append("price", product.price);
      formData.append("shipping_amount", product.shipping_amount);
      formData.append("country", currentAddress.country);
      formData.append("size", sizeValue);
      formData.append("color", colorValue);
      formData.append("cart_id", cardId);

      await apiInstance.post(`cart-view/`, formData);

      const url = userData?.user_id
        ? `cart-list/${cardId}/${userData?.user_id}/`
        : `cart-list/${cardId}/`;
      const response = await apiInstance.get(url);

      setCartCount(response.data.length);
      console.log(response.data.length);
      Toast.fire({
        icon: "success",
        title: "Added To Cart",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToWishlist = () => {
    if (userData) {
      AddToWishlist(product.id, userData?.user_id);
    }
  };

  const handleReviewChange = event => {
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value,
    });
  };

  const fetchReviewData = async () => {
    if (product.id) {
      apiInstance.get(`reviews/${product?.id}/`).then(res => {
        setReviews(res.data);
      });
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [product]);

  const handleReviewSubmit = e => {
    e.preventDefault();

    const formdata = new FormData();

    if (!userData && !userData?.user_id) {
      Swal.fire({
        icon: "error",
        title: "Please login to create a review",
      });
      return;
    }

    formdata.append("user_id", userData?.user_id);
    formdata.append("product_id", product?.id);
    formdata.append("rating", createReview.rating);
    formdata.append("review", createReview.review);

    apiInstance.post(`create-review/`, formdata).then(res => {
      fetchReviewData();
      Swal.fire({
        icon: "success",
        title: "Review created successfully",
      });
    });
  };

  return (
    <main className="mb-4 mt-4">
      <div className="container">
        {/* Section: Product details */}
        <section className="mb-9">
          <div className="row gx-lg-5">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Gallery */}
              <div className="">
                <div className="row gx-2 gx-lg-3">
                  <div className="col-12 col-lg-12">
                    <div className="lightbox">
                      <img
                        src={product.image}
                        style={{
                          width: "100%",
                          height: 800,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                        alt="Gallery image"
                        className="ecommerce-gallery-main-img active w-100 rounded-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 d-flex">
                  {gallery?.map((g, index) => (
                    <div className="p-3" key={index}>
                      <img
                        src={g.image}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                        alt="Gallery image 1"
                        className="ecommerce-gallery-main-img active w-100 rounded-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Gallery */}
            </div>
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Details */}
              <div>
                <h1 className="fw-bold mb-3">{product.title}</h1>
                <div className="d-flex text-primary just align-items-center">
                  <ul className="mb-3 d-flex p-0" style={{ listStyle: "none" }}>
                    {product.product_rating === null && (
                      <li>
                        <i className="fas fa-star fa-sm text-warning ps-0" />
                      </li>
                    )}
                    {product.product_rating > 1 && product.product_rating < 2 && (
                      <li>
                        <i className="fas fa-star fa-sm text-warning ps-0" />
                      </li>
                    )}
                    {product.product_rating > 2 && product.product_rating < 3 && (
                      <>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                      </>
                    )}

                    {product.product_rating > 3 && product.product_rating < 4 && (
                      <>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                      </>
                    )}

                    {product.product_rating > 4 && product.product_rating < 5 && (
                      <>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                      </>
                    )}

                    {product.product_rating > 5 && product.product_rating < 6 && (
                      <>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                      </>
                    )}

                    <li style={{ marginLeft: 10, fontSize: 13 }}>
                      <a href="" className="text-decoration-none align-middle">
                        {product.product_rating !== null && (
                          <>
                            <strong className="me-2 text-dark">
                              {product?.product_rating?.toFixed(1)}/5.0
                            </strong>
                            ({product?.rating_count} reviews)
                          </>
                        )}

                        {product.product_rating === null && (
                          <>
                            <strong className="me-2 text-dark">Not Rated Yet</strong>
                            (0 reviews)
                          </>
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
                <h5 className="mb-3">
                  <s className="text-muted me-2 small align-middle">
                    ${product.old_price}
                  </s>
                  <span className="align-middle">${product.price}</span>
                </h5>
                <p className="text-muted">{product.description}</p>
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th className="ps-0 w-25" scope="row">
                          <strong>Category</strong>
                        </th>
                        <td>{product.category?.title}</td>
                      </tr>

                      {specification.map((s, index) => (
                        <tr key={index}>
                          <th className="ps-0 w-25" scope="row">
                            <strong>{s.title}</strong>
                          </th>
                          <td>{s.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <hr className="my-5" />
                <div>
                  <div className="row flex-column">
                    {/* Quantity */}
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="typeNumber">
                          <b>Quantity</b>
                        </label>
                        <input
                          type="number"
                          id="typeNumber"
                          className="form-control quantity"
                          min={1}
                          value={qtyValue}
                          onChange={handleQuantityChange}
                        />
                      </div>
                    </div>

                    {/* Size */}
                    {size.length > 0 && (
                      <>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Size:</b> {sizeValue}
                            </label>
                          </div>
                          <div className="d-flex">
                            {size.map((s, index) => (
                              <div key={index} className="me-2">
                                <input
                                  type="hidden"
                                  className="size_name"
                                  value={s.name}
                                ></input>
                                <button
                                  onClick={handleSizeButtonClick}
                                  className="btn btn-secondary size_button"
                                >
                                  {s.name}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Colors */}
                    {colors.length > 0 && (
                      <>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Color:</b> <span>{colorValue}</span>
                            </label>
                          </div>
                          <div className="d-flex">
                            {colors.map((c, index) => (
                              <div key={index}>
                                <input
                                  type="hidden"
                                  className="color_name"
                                  value={c.name}
                                  name=""
                                  id=""
                                ></input>
                                <button
                                  type="button"
                                  onClick={handleColorButtonClick}
                                  className="btn p-3 me-2 color_button"
                                  style={{ background: `${c.color_code}` }}
                                ></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded me-2"
                    onClick={handleAddToCart}
                  >
                    <i className="fas fa-cart-plus me-2" /> Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    className="btn btn-danger btn-floating"
                    data-mdb-toggle="tooltip"
                    title="Add to wishlist"
                  >
                    <i className="fas fa-heart" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Specifications
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Vendor
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Review
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
          >
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  {specification.map((s, index) => (
                    <tr key={index}>
                      <th className="ps-0 w-25" scope="row">
                        <strong>{s.title}</strong>
                      </th>
                      <td>{s.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
            tabIndex={0}
          >
            <div className="card mb-3" style={{ maxWidth: 400 }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={vendor?.image}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    alt="User Image"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{vendor?.name}</h5>
                    <p className="card-text">{vendor?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to create a new review */}
                <div className="col-md-6">
                  <h2>Create a New Review</h2>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Rating
                      </label>
                      <select
                        name="rating"
                        onChange={handleReviewChange}
                        className="form-select"
                        id=""
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Star</option>
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewText" className="form-label">
                        Review
                      </label>
                      <textarea
                        className="form-control"
                        id="reviewText"
                        rows={4}
                        placeholder="Write your review"
                        defaultValue={""}
                        value={createReview.review}
                        onChange={handleReviewChange}
                        name="review"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>
                {/* Column 2: Display existing reviews */}
                <div className="col-md-6">
                  <h2>Existing Reviews</h2>
                  {reviews?.map((review, index) => (
                    <div className="card mb-3" key={index}>
                      <div className="row g-0">
                        <div className="col-md-3">
                          <img
                            src={review.profile?.image}
                            alt="User Image"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="card-body">
                            <h5 className="card-title">
                              {review.profile.full_name}
                            </h5>
                            <p className="card-text">
                              {moment(review.date).format(
                                "dddd, MMMM Do YYYY, h:mm:ss a",
                              )}
                            </p>{" "}
                            <br />
                            <p className="card-text">Rating: {review.rating}</p>
                            <p className="card-text">{review.review}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* More reviews can be added here */}
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-disabled"
            role="tabpanel"
            aria-labelledby="pills-disabled-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to submit new questions */}
                <div className="col-md-6">
                  <h2>Ask a Question</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="askerName" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="askerName"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="questionText" className="form-label">
                        Question
                      </label>
                      <textarea
                        className="form-control"
                        id="questionText"
                        rows={4}
                        placeholder="Ask your question"
                        defaultValue={""}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Question
                    </button>
                  </form>
                </div>
                {/* Column 2: Display existing questions and answers */}
                <div className="col-md-6">
                  <h2>Questions and Answers</h2>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 1</h5>
                      <p className="card-text">August 10, 2023</p>
                      <p className="card-text">
                        What are the available payment methods?
                      </p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        We accept credit/debit cards and PayPal as payment methods.
                      </p>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 2</h5>
                      <p className="card-text">August 15, 2023</p>
                      <p className="card-text">How long does shipping take?</p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        Shipping usually takes 3-5 business days within the US.
                      </p>
                    </div>
                  </div>
                  {/* More questions and answers can be added here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
