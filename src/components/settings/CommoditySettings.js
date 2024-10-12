import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CommoditySettings = () => {
  const [supportedCommodities, setSupportedCommodities] = useState([]);
  const [activatedCommodities, setActivatedCommodities] = useState([]);
  const [message, setMessage] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showCashewNutDetails, setShowCashewNutDetails] = useState(false);
  const [lossThresholds, setLossThresholds] = useState({
    boilingSteaming: 0.0,
    grading: 0.0,
    cutting: 0.0,
    primaryShelling: 0.0,
    secondaryShelling: 0.0,
    bormaDrying: 0.0,
    cooling: 0.0, // Renamed from chilling to cooling
    peeling: 0.0,
    sweating: 0.0,
    sorting: 0.0,
    packaging: 0.0,
  });
  const [isCashewNutActivated, setIsCashewNutActivated] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getSleekId = () => {
    return localStorage.getItem("sleekId");
  };

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const token = getToken();
        const sleekId = getSleekId();

        if (!token || !sleekId) {
          setMessage("Sleek ID or token not found. Please log in again.");
          return;
        }

        const [supportedResponse, activatedResponse] = await Promise.all([
          fetch("http://localhost:8080/api/commodities/support-commodities", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:8080/api/commodities/activated-commodities", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!supportedResponse.ok || !activatedResponse.ok) {
          throw new Error("Failed to fetch commodities.");
        }

        const supportedData = await supportedResponse.json();
        const activatedData = await activatedResponse.json();

        setSupportedCommodities(supportedData);
        setActivatedCommodities(activatedData);

        setIsCashewNutActivated(activatedData.includes("Cashew Nut"));
      } catch (error) {
        console.error("Error fetching commodities:", error);
        setMessage("Failed to fetch commodities.");
      }
    };

    const fetchLossThresholds = async () => {
      try {
        const token = getToken();
        const sleekId = getSleekId();

        if (!token || !sleekId) {
          setMessage("Sleek ID or token not found. Please log in again.");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/${sleekId}/commodities/process-stages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch loss thresholds.");
        }

        const data = await response.json();
        setLossThresholds(data);
      } catch (error) {
        console.error("Error fetching loss thresholds:", error);
        setMessage("Failed to fetch loss thresholds.");
      }
    };

    fetchCommodities();
    fetchLossThresholds();
  }, []);

  const handleSettingsToggle = () => {
    setShowSettingsMenu((prev) => !prev);
  };

  const handleProfile = () => {
    setShowSettingsMenu(true);
    navigate("/dashboard/profile");
  };

  const handleCommodities = () => {
    setShowSettingsMenu(true);
    navigate("/dashboard/commodity-settings");
  };

  const handleHistory = () => {
    setShowSettingsMenu(true);
    navigate("/dashboard/history");
  };

  const handleCashewNutClick = () => {
    setShowCashewNutDetails(true);
  };

  const handleLossThresholdChange = async (process, value) => {
    setLossThresholds((prev) => ({ ...prev, [process]: value }));

    try {
      const token = getToken();
      const sleekId = getSleekId();

      if (!token || !sleekId) {
        setMessage("Sleek ID or token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/${sleekId}/commodities/process-stages/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...lossThresholds,
            [process]: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update loss thresholds.");
      }
    } catch (error) {
      console.error("Error updating loss thresholds:", error);
      setMessage("Failed to update loss thresholds.");
    }
  };

  const handleResetLossThresholds = async () => {
    try {
      const token = getToken();
      const sleekId = getSleekId();

      if (!token || !sleekId) {
        setMessage("Sleek ID or token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/${sleekId}/commodities/process-stages/reset`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset loss thresholds.");
      }

      const data = await response.json();
      setLossThresholds(data);
    } catch (error) {
      console.error("Error resetting loss thresholds:", error);
      setMessage("Failed to reset loss thresholds.");
    }
  };

  const handleActivateToggle = () => {
    if (isCashewNutActivated) {
      setIsCashewNutActivated(false);
      setActivatedCommodities((prev) =>
        prev.filter((commodity) => commodity !== "Cashew Nut")
      );
    } else {
      setIsCashewNutActivated(true);
      setActivatedCommodities((prev) => [...prev, "Cashew Nut"]);
    }
  };

  return (
    <div className="flex ml-36">
      <div className="flex flex-col flex-1">
        <div className="flex flex-1">
          <div className="flex-1 gap-8 flex flex-col overflow-y-auto">
            {showCashewNutDetails ? (
              <div className="flex flex-1">
                <div className="flex-1 bg-white p-6 rounded">
                  <h1 className="text-2xl font-bold mb-4">
                    Manage Cashew Nut Processing
                  </h1>
                  <p className="mb-6">
                    Manage the loss thresholds and activation status for Cashew
                    Nut processing.
                  </p>

                  {/* Boiling/Steaming Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Boiling/Steaming</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.boilingSteaming}
                        onChange={(e) =>
                          handleLossThresholdChange(
                            "boilingSteaming",
                            e.target.value
                          )
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Grading Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Grading</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.grading}
                        onChange={(e) =>
                          handleLossThresholdChange("grading", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Cutting Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Cutting</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.cutting}
                        onChange={(e) =>
                          handleLossThresholdChange("cutting", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Primary Shelling Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Primary Shelling</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.primaryShelling}
                        onChange={(e) =>
                          handleLossThresholdChange(
                            "primaryShelling",
                            e.target.value
                          )
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Secondary Shelling Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                      Secondary Shelling
                    </h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.secondaryShelling}
                        onChange={(e) =>
                          handleLossThresholdChange(
                            "secondaryShelling",
                            e.target.value
                          )
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Borma Drying Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Borma Drying</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.bormaDrying}
                        onChange={(e) =>
                          handleLossThresholdChange(
                            "bormaDrying",
                            e.target.value
                          )
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Cooling Section (Renamed from Chilling) */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Cooling</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.cooling}
                        onChange={(e) =>
                          handleLossThresholdChange("cooling", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Peeling Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Peeling</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.peeling}
                        onChange={(e) =>
                          handleLossThresholdChange("peeling", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Sweating Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Sweating</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.sweating}
                        onChange={(e) =>
                          handleLossThresholdChange("sweating", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Sorting Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Sorting</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.sorting}
                        onChange={(e) =>
                          handleLossThresholdChange("sorting", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Packaging Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Packaging</h2>
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Loss Threshold</span>
                      <input
                        type="number"
                        value={lossThresholds.packaging}
                        onChange={(e) =>
                          handleLossThresholdChange("packaging", e.target.value)
                        }
                        className="w-16 p-1 bg-gray-200 text-gray-900 rounded"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleResetLossThresholds}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
                    >
                      Reset Loss Thresholds
                    </button>
                    <button
                      onClick={handleActivateToggle}
                      className={`px-4 py-2 text-white rounded ${
                        isCashewNutActivated
                          ? "bg-red-500 hover:bg-red-400"
                          : "bg-green-500 hover:bg-green-400"
                      }`}
                    >
                      {isCashewNutActivated
                        ? "Deactivate Cashew Nut Processing"
                        : "Activate Cashew Nut Processing"}
                    </button>
                  </div>
                </div>

                {/* Right Sidebar for Commodities */}
                <div className="w-80 bg-gray-100 p-6 rounded">
                  <h2 className="text-2xl font-bold mb-4">
                    Supported Commodities
                  </h2>
                  <ul className="mb-4">
                    {supportedCommodities.length > 0 ? (
                      supportedCommodities.map((commodity, index) => (
                        <li key={index} className="text-gray-700">
                          {commodity}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-700">Cashew Nut</li>
                    )}
                  </ul>
                  <h2 className="text-2xl font-bold mb-4">
                    Activated Commodities
                  </h2>
                  <ul>
                    {activatedCommodities.length > 0 ? (
                      activatedCommodities.map((commodity, index) => (
                        <li key={index} className="text-gray-700">
                          {commodity}
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">None</p>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-1">
                <div className="flex-1 bg-white p-6 rounded">
                  <h1 className="text-2xl font-bold mb-4">
                    Manage Commodity Processing
                  </h1>
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold">Data</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit...
                      </p>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold">Dashboard</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit...
                      </p>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold">Insights</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-80 bg-gray-100 h-full">
                  <h2 className="text-2xl font-bold mb-4">
                    Supported Commodities
                  </h2>
                  <ul className="mb-4">
                    {supportedCommodities.length > 0 ? (
                      supportedCommodities.map((commodity, index) => (
                        <li
                          key={index}
                          onClick={handleCashewNutClick}
                          className="text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded"
                        >
                          {commodity}
                        </li>
                      ))
                    ) : (
                      <li
                        onClick={handleCashewNutClick}
                        className="text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded"
                      >
                        Cashew Nut
                      </li>
                    )}
                  </ul>
                  <h2 className="text-2xl font-bold mb-4">
                    Activated Commodities
                  </h2>
                  <ul>
                    {activatedCommodities.length > 0 ? (
                      activatedCommodities.map((commodity, index) => (
                        <li key={index} className="text-gray-700">
                          {commodity}
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">None</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommoditySettings;
