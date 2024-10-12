import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    subscriptionId: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/subscriptions/${formData.subscriptionId}/login`,
        {
          password: formData.password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data); // Store JWT token
        localStorage.setItem("sleekId", formData.subscriptionId); // Store JWT token
        console.log(response.data);
        navigate("/workspace"); // Redirect to dashboard or home page on successful login
      } else {
        setErrorMessage("Invalid Subscription ID or Password.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid Subscription ID or Password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-sans text-center">
          Login to Sleek
        </h1>
        <p className="text-lg sm:text-xl mb-4 font-sans text-center">
          See how your processing plant is performing
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Enter your unique Sleek ID{" "}
              <span className="text-red-500">(required)</span>
            </label>
            <input
              type="text"
              name="subscriptionId"
              value={formData.subscriptionId}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="http://www.krissaco.com/"
              required
            />
            <p className="text-sm text-gray-600 mt-1 font-sans">
              Do not have a Sleek ID?{" "}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={handleRegisterRedirect}
              >
                Register!
              </span>
            </p>
          </div>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Enter password <span className="text-red-500">(required)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="text-sm text-gray-600 mt-1 font-sans">
            Forgot password? Click{" "}
            <span className="text-blue-500 cursor-pointer underline">here</span>{" "}
            and check your registered email for the password.
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Login
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              onClick={() => setFormData({ subscriptionId: "", password: "" })}
            >
              Clear
            </button>
          </div>
        </form>
        {errorMessage && (
          <p className="text-red-500 mt-4 font-sans">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
