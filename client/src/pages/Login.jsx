import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { FaWallet } from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();
  useEffect(() => {

  const token = localStorage.getItem(
    "token"
  );

  if (token) {

    navigate("/dashboard");
  }

}, []);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      toast.success(
        response.data.message
      );

      navigate("/dashboard");

      setLoading(false);

    } catch (error) {

      setLoading(false);

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <div className="flex flex-col items-center mb-8">

          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl mb-4">

            <FaWallet />

          </div>

          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="text-slate-300 mt-2">
            Login to your account
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
          />


          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all py-3 rounded-xl font-semibold disabled:opacity-70"
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

        </form>


        <p className="text-center mt-6 text-slate-300">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-emerald-400 font-semibold"
          >
            Register
          </Link>

        </p>

      </motion.div>

    </div>
  );
}

export default Login;