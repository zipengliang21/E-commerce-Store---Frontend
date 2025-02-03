import { useState } from "react";
import apiInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = e => {
    try {
      apiInstance.get(`user/password-reset/${email}/`).then(res => {
        console.log(res.data);
        alert("The Password Reset Email has been sent to your email");
        navigate("/create-new-password");
      });
    } catch (error) {
      alert("Email Does Not Exist");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <p>Enter your email to reset your password</p>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter Email"
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  );
}

export default ForgotPassword;
