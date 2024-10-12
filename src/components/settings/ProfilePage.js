import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imageError, setImageError] = useState(""); // New state for image validation error

  const navigate = useNavigate();

  // Fetch sleekId and token from localStorage
  const sleekId = localStorage.getItem("sleekId");
  const token = localStorage.getItem("token");

  // Fetch the subscription details from the backend on component mount
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!token || !sleekId) {
        navigate("/login"); // Redirect if token or sleekId is missing
        return;
      }

      try {
        // API call to fetch subscription details based on sleekId
        const response = await axios.get(
          `http://localhost:8080/subscriptions/${sleekId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in Authorization header
            },
          }
        );

        if (response.status === 200) {
          // Set workspace name and email from the fetched data
          setWorkspaceName(response.data.workspaceName);
          setSubscriberEmail(response.data.email);
        } else {
          navigate("/login"); // Redirect if request fails
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        navigate("/login"); // Redirect on error
      }
    };

    fetchSubscriptionDetails();
  }, [sleekId, token, navigate]);

  // Handle profile picture selection and validate file type
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png"];

    if (file && validImageTypes.includes(file.type)) {
      setProfileImage(file);
      setImageError(""); // Clear any previous errors
    } else {
      setProfileImage(null);
      setImageError("Only .jpg and .png images are allowed."); // Set error message
    }
  };

  // Handle form submission for updating the subscription
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Check if there is any image error before submitting
    if (imageError) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    // Prepare form data for the update
    const formData = new FormData();
    formData.append("workspaceName", workspaceName);
    formData.append("email", subscriberEmail);
    if (password) formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      // Make the API request to update subscription details
      const response = await axios.put(
        `http://localhost:8080/subscriptions/${sleekId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      if (response.status === 200) {
        setMessage("Subscription updated successfully!");
      } else {
        setMessage("Error updating subscription.");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      setMessage("Failed to update subscription.");
    }
  };

  return (
    <div className="flex ml-36">
      {/* Update Settings Form */}
      <div className="flex-1 bg-white p-6 rounded overflow-scroll ">
        <h1 className="text-2xl font-bold mb-4">Change Profile Settings</h1>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleFormSubmit}>
          {/* Organization Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Do you want to change the name of your organization?
            </label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Organization Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Do you want to change your email?
            </label>
            <input
              type="email"
              className="border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Do you want to change Password?
            </label>
            <input
              type="password"
              className="border rounded w-full py-2 px-3 text-gray-700"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm password
            </label>
            <input
              type="password"
              className="border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Do you want to change your profile picture?
            </label>
            <input
              type="file"
              className="border rounded w-full py-2 px-3"
              onChange={handleProfileImageChange}
            />
            {imageError && <p className="text-red-500">{imageError}</p>}{" "}
            {/* Display image validation error */}
          </div>
          <div className="flex">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded mr-4"
            >
              Update Settings
            </button>
            <button
              type="reset"
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setWorkspaceName("");
                setSubscriberEmail("");
                setPassword("");
                setConfirmPassword("");
                setProfileImage(null);
                setImageError(""); // Reset image error
                setMessage("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Current Settings Section */}
      <div className="w-80 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Your Current Settings</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Organization Name</h3>
          <p className="text-gray-700">{workspaceName}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-gray-700">{subscriberEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
