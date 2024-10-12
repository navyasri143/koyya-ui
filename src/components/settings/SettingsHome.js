// src/components/Suggestions2.js
import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "./SettingsMenu";
import ProfilePage from "./ProfilePage";
import CommoditySettings from "./CommoditySettings";
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import History from "./History";


const SettingsHome = ({ handleProfile }) => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="flex-1 mt-0 ml-36 ">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">
          This is where you prepare Sleek for you
        </h1>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="flex items-center mb-6 bg-white p-4 rounded">
          <img
            src="/profile-image.png"
            alt="Profile"
            className="w-24 h-24 mr-4"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              Let your profile reflects you
            </h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </p>
            <button
              onClick={handleProfile}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Go to Profile Settings
            </button>
          </div>
        </div>
        <div className="flex items-center mb-6 bg-white p-4 rounded">
          <img
            src="/processing-image.png"
            alt="Processing"
            className="w-24 h-24 mr-4"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              Design Processing Workflows
            </h2>
            <p className="text-gray-600 mb-4">
              Pd tempor incididunt ut labore et dolore magna aliqua...
            </p>
            <button
              onClick={() => navigate("/dashboard/commodity-settings")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Go to Commodities Settings
            </button>
          </div>
        </div>
        <div className="flex items-center bg-white p-4 rounded">
          <img
            src="/efficiency-image.png"
            alt="Efficiency"
            className="w-24 h-24 mr-4"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Audit the changes</h2>
            <p className="text-gray-600 mb-4">
              Adipisicing elit, sed do eiusmod tempor incididunt...
            </p>
            <button className="bg-black text-white px-4 py-2 rounded">
              Go to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHome;
