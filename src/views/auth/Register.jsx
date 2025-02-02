import React, { useEffect, useState } from 'react';
import { register } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

function Register() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await register(fullname, email, phone, password, password2);
        if (error) {
            alert(JSON.stringify(error));
        } else {
            navigate('/');
        }

        setIsLoading(false);
    };

  return (
    <>
        <div>Register</div>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="username"
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
                required
            />
            <br />
            <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <br />
            <input
                type="text"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
            />
            <br />
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <br />
            <input
                type="password"
                id="confirm-password"
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Comfirm Password"
                required
            />
            <br />
            <br />
            <button type="submit">Register</button>
        </form>
    </>
  )
}

export default Register