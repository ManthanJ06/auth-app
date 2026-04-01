import React from 'react';
import {useNavigate} from 'react-router-dom';

const Login = () => {
       const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const a = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: e.target.email.value,
                password: e.target.password.value
        })
    });
    e.target.reset();
    const res = await a.json();
if (a.ok) {
    // localStorage.setItem('token', res.token);
    navigate('/home');
}

 console.log(res);
    }
    return (
        <div className="flex flex-col gap-2 justify-center items-center mt-10">
                <h1 className="text-2xl font-bold">Login Page</h1>
                <form method="POST" onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
                    <input type="text" className="p-2 rounded-md bg-zinc-700 border border-zinc-600" name="email" placeholder="Email" required />
                    <input type="password" className="p-2 rounded-md bg-zinc-700 border border-zinc-600" name="password" placeholder="Password" required/>
                    <input type="submit" className="p-2 rounded-md bg-green-600 hover:bg-green-800 cursor-pointer text-white font-bold" value="Login" />
                </form>
            </div>
    );
}

export default Login;
