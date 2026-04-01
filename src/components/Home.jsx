import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/me', {
      credentials: 'include', // ⭐ cookie sent automatically
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => setLoading(false))
      .catch(() => navigate('/login'));
  }, []);

  if (loading) return <p>Loading...</p>;

  return <h1>Welcome to Main Page 🎉</h1>;
};

export default Home;

