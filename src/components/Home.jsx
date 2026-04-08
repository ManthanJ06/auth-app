import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Todo from "./todo";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Auth check failed:", err);
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
   
      <div className="p-6 justify-center items-center flex">
       <Todo />
      </div>
    </>
  );
};

export default Home;
