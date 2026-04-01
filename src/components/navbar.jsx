import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-zinc-500 text-white p-4 w-full flex justify-end">
            <Link to="/login">
                <button className="mr-4 rounded-md bg-zinc-700 px-4 py-2">Login</button>
            </Link>
            <Link to="/register">
                <button className="rounded-md bg-zinc-700 px-4 py-2">Register</button>
            </Link>
        </nav>
    );
}

export default Navbar;
