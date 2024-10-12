import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");

  // Helper function to get the first characters of the workspace name
  function getFirstCharacters(str) {
    if (!str) {
      return "";
    }
    const words = str.trim().split(/\s+/);
    const firstChar = words[0][0];
    let secondChar = "";
    if (words.length > 1) secondChar = words[1][0];
    return (firstChar + secondChar).toUpperCase();
  }

  // useEffect to fetch the profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const sleekId = localStorage.getItem("sleekId");

      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      try {
        // Fetch subscription details using the sleekId
        const response = await axios.get(
          `http://localhost:8080/subscriptions/${sleekId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setWorkspaceName(response.data.workspaceName);
          setEmail(response.data.email);
          localStorage.setItem("email",response.data.email);
        } else {
          navigate("/login"); // Redirect to login if the request fails
        }
      } catch (error) {
        navigate("/login"); // Redirect to login if any error occurs
      }
    };

    fetchProfile(); // Call the fetchProfile function
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const sleekId = localStorage.getItem("sleekId");

    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
      return;
    }

    try {
      // Make logout request
      await axios.post(
        `http://localhost:8080/subscriptions/${sleekId}/logout`,
        { token: token }, // Pass the token in the body of the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("sleekId");

      // Redirect to home page after successful logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error); // Log error if logout fails
    }
  };

  return (
    <div className="header h-16 bg-white border-b fixed top-0 left-20 right-0 flex items-center p-5 z-10">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full text-2xl">
          {getFirstCharacters(workspaceName)}
        </div>
        <h1 className="pl-3 text-2xl font-bold">{workspaceName}</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="text-xs text-gray-600">
          Your Sleek ID is {localStorage.getItem("sleekId")} and is connected to{" "}
          {email}
          <br />
          Your last login was at 18:30 Hrs on 3 August 2024 from 1.2.3.4
        </div>
        <button
          className="bg-gray-600 text-white px-4 py-2 mr-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Banner;
