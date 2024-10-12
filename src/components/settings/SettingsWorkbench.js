// src/components/Suggestions2.js
import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "./SettingsMenu";
import SettingsHome from "./SettingsHome";
import ProfilePage from "./ProfilePage";
import CommoditySettings from "./CommoditySettings";
import { Routes, Route } from 'react-router-dom';
import History from "./History";

const SettingsWorkbench = () => {
  return (
    <div className="flex-1 mt-16 ml-20 ">
      <SettingsMenu />
      <div>
        <Routes>
          <Route index element={<SettingsHome/>}/>
          <Route path="Home" element={<SettingsHome/>} />
          <Route path="Profile" element={<ProfilePage/>} />
          <Route path="Commodities" element={<CommoditySettings />} />
          <Route path="History" element={<History />} />
        </Routes>
      </div>
    </div>
  );
};

export default SettingsWorkbench;
