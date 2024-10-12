// src/components/Sidebar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import krissaco from "../images/krissaco-mascot.png"
import cashewnuts from "../images/cashewnut.png";
import settings from "../images/settings.png";

const NavigationBar = ({ onSettingsClick, activatedCommodities }) => {
  // State to manage Cashew Nut Menu visibility
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Check if Cashew Nut is activated
  const isCashewNutActivated =
    Array.isArray(activatedCommodities) &&
    activatedCommodities.includes("Cashew Nut");

  // Toggle Cashew Nut Menu visibility
  const toggleMenu = () => {
    setIsMenuVisible((prevState) => !prevState);
  };

  return (
    <div className="bg-green-600 p-4 fixed flex top-0 left-0 flex-col justify-between justify-center items-center h-full w-20">
      {/*

      {isCashewNutActivated && (
        <button
          onClick={toggleMenu}
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
        >
          Cashew Nut
        </button>
      )}


      {isMenuVisible && (
        <div className="relative">
          {" "}
          <div className="absolute left-full mt-6">
            {" "}
            <CashewNutMenu />
          </div>
        </div>
      )}
      */}
      <div>
        <Link to="/" className="mr-4">
          <img
            src={krissaco}
            alt="Sleek Logo"
            className="h-25 width-auto" // Adjusted the margin-bottom to create space between the logo and the Cashew Nut button
          />
          <div className="text-xs text-white text-center">Krissaco Sleek V1</div>
        </Link>
      </div>
      <div>
        <Link to="cashew" className="mr-4">
          <img
            src={cashewnuts}
            alt="Settings"
            className="w-24 h-auto"
          />
          <div className="text-xs text-white text-center">Cashewnut</div>
        </Link>
      </div>
      <div className="mt-auto">
        <Link to="settings" className="mr-4">
          <img
            src={settings}
            alt="Settings"
            className="w-24 h-auto"
          />
          <div className="text-xs text-white text-center">Settings</div>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
