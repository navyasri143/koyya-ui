import axios from "axios";
import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    workspaceName: "",
    email: "",
    subscriptionId: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/subscriptions/register",
        {
          workspaceName: formData.workspaceName,
          email: formData.email,
          sleekId: formData.subscriptionId,
          password: formData.password,
        }
      );

      setSuccessMessage(
        "Registration successful! Please check your email for the activation link."
      );
      setErrorMessage("");

      // Clear form fields
      setFormData({
        workspaceName: "",
        email: "",
        subscriptionId: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Subscription ID or Email already exists.");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  const handleClear = () => {
    setFormData({
      workspaceName: "",
      email: "",
      subscriptionId: "",
      password: "",
      confirmPassword: "",
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-sans text-center">
          Register with Sleek
        </h1>
        <p className="text-lg sm:text-xl mb-4 font-sans text-center">
          Start your journey to efficient processing days
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Tell the name of your organization{" "}
              <span className="text-red-500">(required)</span>
            </label>
            <input
              type="text"
              name="workspaceName"
              value={formData.workspaceName}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="The name can have a maximum of 32 characters"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Choose a unique ID for your Sleek account{" "}
              <span className="text-red-500">(required)</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-600 bg-gray-200 border border-r-0 border-gray-400 rounded-l-md">
                http://www.krissaco.com/
              </span>
              <input
                type="text"
                name="subscriptionId"
                value={formData.subscriptionId}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-r-md"
                placeholder="The Sleek ID must be 8 characters in length"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Enter an email ID which you use for activation and login{" "}
              <span className="text-red-500">(required)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="Please ensure you enter a valid email address."
              required
            />
            <p className="text-sm text-gray-600 mt-1 font-sans">
              You will receive the Sleek activation link to this email address.
              You will also use this email ID for login to Sleek.
            </p>
          </div>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Password <span className="text-red-500">(required)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="Create a secure password for log in."
              required
            />
            <p className="text-sm text-gray-600 mt-1 font-sans">
              The password must be 10 characters in length. It must include
              letters, numbers, and at least one of the special characters (&,
              @, #, $). Your Sleek ID must not be part of the password.
            </p>
          </div>
          <div className="mb-4">
            <label className="text-lg font-sans mb-2 block">
              Confirm Password <span className="text-red-500">(required)</span>
            </label>
            <input
              type="text" // Changed from 'password' to 'text'
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md"
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
            >
              Clear
            </button>
          </div>
        </form>
        {errorMessage && (
          <p className="text-red-500 mt-4 font-sans">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 mt-4 font-sans">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
