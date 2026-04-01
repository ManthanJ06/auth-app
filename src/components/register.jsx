import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


const Register = () => {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const {
        register,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const a = await fetch('http://localhost:5000/register-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: e.target.email.value,
                password: e.target.password.value
            })
        });
        e.target.reset();
        const res = await a.json();
        if (!a.ok) {
            setIsError(true);
            setMessage(res.message);
        } else {
            setIsError(false);
            setMessage('User registered successfully, Go to login');
        }
        console.log(res);
        reset();
    }
    return (
        <>
            <div className="flex flex-col gap-2 justify-center items-center mt-10">
            <h1 className="text-2xl font-bold">Register page</h1>
               

                {isSubmitting && <p>Submitting...</p>}
                <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
                    <input type="text" className="p-2 rounded-md bg-zinc-700 border border-zinc-600" name="email" placeholder="Email" required />
                    <input type="password" className="p-2 rounded-md bg-zinc-700 border border-zinc-600" name="password" placeholder="Password" />
                    <input type="submit" className="p-2 rounded-md bg-green-600 hover:bg-green-800 cursor-pointer text-white font-bold" value="Register" />
                 {message && (
                    <p className={`${isError ? 'text-red-500' : 'text-green-500'} mt-3 ml-4`}>
                        {message} 
                    </p>
                )}
                {!message && <p className="text-gray-500 mt-3 ml-4">Please register...</p>}
                </form>
            </div>
        </>
    );
}

export default Register;
