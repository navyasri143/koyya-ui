import React from "react";
import { useNavigate } from "react-router-dom";
import profile from "../components/images/profile.png";
import cashewnut from "../components/images/cashewnut.png";

const DefaultWorkbench = ({
  handleProfile,
  handleCommodities,
  handleProcessing,
}) => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="flex-1 mt-16 ml-20 pl-8 pt-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to Krissaco Sleek! What would you like to do today?
      </h1>
      <p className="mb-4 text-gray-600">
      You can easily update your profile, activate Cashew Nut Processing, or analyze your processing efficiencies. <br/>
      Everything you need is just a click away.
      </p>
      <div className="flex items-center mb-6 p-0 rounded">
        <img
          src={profile}
          alt="Profile"
          className="w-24 h-24 mr-4"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">
            You can change your profile
          </h2>
          <p className="text-gray-600 mb-1">
          Easily update your personal details preferences and contact information to keep your profile up-to-date and tailored to your needs.
          </p>
          <button
            onClick={handleProfile}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Go to Profile Settings
          </button>
        </div>
      </div>
      <div className="flex items-center mb-6 p-0 rounded">
        <img
          src={cashewnut}
          alt="Processing"
          className="w-24 h-24 mr-4"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">
            You can activate Cashew Nut Processing
          </h2>
          <p className="text-gray-600 mb-1">
            Kickstart your cashew nut processing operations with just a few clicks, ensuring everything is set up and ready to go.
          </p>
          <button
            onClick={() => navigate("/dashboard/commodity-settings")}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Go to Commodities
          </button>
        </div>
      </div>
      <div className="flex items-center p-0 rounded">
        <img
          src={profile}
          alt="Efficiency"
          className="w-24 h-24 mr-4"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">
            Analyse your Processing Efficiencies
          </h2>
          <p className="text-gray-600 mb-1">
            Get insights into how efficiently your processing operations are running, helping you optimize and improve your workflow.
          </p>
          <button
            onClick={handleProcessing}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Go to Cashew Nut Processing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultWorkbench;
