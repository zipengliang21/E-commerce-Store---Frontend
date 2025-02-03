import { useState } from 'react'
import apiInstance from '../../utils/axios'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    
    const handleSubmit = (e) => {
       apiInstance.get(`user/password-reset/${email}/`).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <p>Enter your email to reset your password</p>
            <input 
                type="email" 
                name="email"
                id="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <button onClick={handleSubmit}>Reset Password</button>
        </div>
    )
}

export default ForgotPassword