import { useState } from "react";
import apiInstance from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = e => {
    setIsLoading(true);
    try {
      apiInstance.get(`user/password-reset/${email}/`).then(res => {
        console.log(res.data);
        alert("The Password Reset Email has been sent to your email");
        setIsLoading(false);
        navigate("/create-new-password");
      }).catch(err => {
        alert("Email Does Not Exist");
        setIsLoading(false);
      });
    } catch (error) {
      alert("Email Does Not Exist");
      setIsLoading(false);
    }
  };

  return (
    <section>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Forgot Password</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <div>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Enter Your Email Address to Reset Your Password Please
                            </label>
                            <input
                              type="text"
                              id="email"
                              name="email"
                              className="form-control"
                              onChange={e => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="text-center">
                            {isLoading ?
                              <button
                                disabled
                                className="btn btn-primary btn-rounded w-100"
                              >
                                Processing... <i className="fas fa-spinner fa-spin" />
                              </button>
                              :
                              <button onClick={handleSubmit} className='btn btn-primary w-100'>Send Email</button>}
                          </div>
                          <div className="text-center mt-3">
                            <p>
                              Want to Sign in? <Link to="/login">Login</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default ForgotPassword;
