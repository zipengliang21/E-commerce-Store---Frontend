import React, { useState, useEffect} from 'react'
import { login } from '../../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

function Login() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const isLoggedIn = useAuthStore(state => state.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/')
        }
    })

    const resetForm = () => {
        setUserName("")
        setPassword("")
    }

    const handleLogin = async (e) => {
        e.preventDafault()
        setIsLoading(true)
    }

    return (
        <div>Login</div>
    )
}

export default Login