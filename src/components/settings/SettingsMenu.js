import React from "react";
import { Link } from "react-router-dom";

const SettingsMenu = ({ handleProfile, handleCommodities, handleHistory }) => {
  return (
    <div className="w-36 bg-green-200 shadow-lg fixed h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <ul>
          <li className="mb-2">
            <Link to={"home"}>Home</Link>
          </li>
          <li className="mb-2">
            <Link to={"profile"}>Profile</Link>
          </li>
          <li className="mb-2">
            <Link to={"commodities"}>Commodities</Link>
          </li>
          <li className="mb-2">
            <Link to={"history"}>History</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsMenu;
