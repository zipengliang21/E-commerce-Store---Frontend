import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import apiInstance from '../../utils/axios'

function CreatePassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const otp = searchParams.get("otp")
    const uidb64 = searchParams.get("uidb64")

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            alert("Password does not match")
            return
        } else {
            const formData = new FormData()
            formData.append("password", password)
            formData.append("otp", otp)
            formData.append("uidb64",uidb64)

            try {
                await apiInstance.post("user/password-change/", formData).then((res) => {
                    console.log(res.data)
                    alert("Password has been changed successfully")
                    navigate("/login")
                })
            } catch (error) {
                alert("Error in creating new password")
            }
        }
    }

    return (
      <div>
        <h1>Create New Password</h1>
        <form onSubmit={handlePasswordSubmit}>
            <input 
                type="password"
                name="password"
                id="password"
                placeholder="Enter New Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <input 
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            <br />
            <button type="submit">Save New Password</button>
        </form>
      </div>
    )
}

export default CreatePassword