import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

const MainScreen = () => {
  const [subscriptionId, setSubscriptionId] = useState("Loading...");
  const [workspaceName, setWorkspaceName] = useState("Navayuva Agro");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/subscriptions/sleek/details"
        );
        setSubscriptionId(response.data.subscriptionId);
      } catch (error) {
        console.error("Error fetching subscription ID:", error);
        setSubscriptionId("Unknown");
      }
    };
    fetchSubscriptionId();
  }, []);

  useEffect(() => {
    if (
      subscriptionId &&
      subscriptionId !== "Loading..." &&
      subscriptionId !== "Unknown"
    ) {
      const fetchWorkspaceName = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/subscriptions/sleek/${subscriptionId}/details`
          );
          setWorkspaceName(response.data.workspaceName || "Unknown Workspace");
        } catch (error) {
          console.error("Error fetching workspace name:", error);
          setWorkspaceName("Unknown Workspace");
        }
      };
      fetchWorkspaceName();
    }
  }, [subscriptionId]);

  const handleProfile = () => {
    setShowSettingsMenu(true); // Show settings menu alongside
    navigate("/dashboard/profile");
  };

  const handleSettingsToggle = () => {
    setShowSettingsMenu((prev) => !prev); // Toggle settings menu visibility
  };

  const handleCommodities = () => {
    setShowSettingsMenu(true); // Show settings menu alongside
    navigate("/dashboard/commodity-settings");
  };

  const handleHistory = () => {
    navigate("/dashboard/history");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/*
      <div className="flex flex-col flex-1 ml-20">
        <div className="flex flex-1">
          {showSettingsMenu && (
            <SettingsMenu
              handleProfile={handleProfile}
              handleCommodities={handleCommodities}
              handleHistory={handleHistory} // Pass handleHistory here
              className="w-1/4"
            />
          )}
          <div className="flex-1 overflow-y-auto mt-16">
            <Routes>
              <Route
                path="/"
                element={<Suggestions handleProfile={handleProfile} />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route
                path="commodity-settings"
                element={<CommoditySettings />}
              />
              <Route
                path="history"
                element={<History subscriberId={subscriptionId} />}
              />
            </Routes>
          </div>
        </div>
      </div>*/}
      <div>
        sadfasfasdfds sadf asd fasf asf 
        <Outlet/>
      </div>
    </div>
  );
};

export default MainScreen;
