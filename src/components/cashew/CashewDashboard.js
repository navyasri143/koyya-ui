import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportIcon from "../images/Export button.png";
import MailIcon from "../images/Mail icon.png";
import PdfIcon from "../images/PDF icon.png";
import BarGraph from "./BarGraph";

const CashewNutDashboard = () => {
  const [processData, setProcessData] = useState({});
  const [stagesData, setStagesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [viewType, setViewType] = useState("Charts");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      const fetchData = async () => {
        const sleekId = localStorage.getItem("sleekId");
        const token = localStorage.getItem("token");

        if (!sleekId || !token) {
          setError("Sleek ID or token not found. Please log in again.");
          return;
        }

        setLoading(true);

        try {
          const processingResponse = await fetch(
            `http://localhost:8080/api/${sleekId}/processing?date=${selectedDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const stagesResponse = await fetch(
            `http://localhost:8080/api/${sleekId}/commodities/process-stages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Log actual status codes and statuses
          if (!processingResponse.ok) {
            console.error(
              `Processing API Error: ${processingResponse.status} - ${processingResponse.statusText}`
            );
          }
          if (!stagesResponse.ok) {
            console.error(
              `Stages API Error: ${stagesResponse.status} - ${stagesResponse.statusText}`
            );
          }

          // Detailed status error handling
          if (!processingResponse.ok || !stagesResponse.ok) {
            const errorMessage = `Processing API status: ${
              processingResponse.status || "Unknown"
            }, Stages API status: ${stagesResponse.status || "Unknown"}`;
            throw new Error(errorMessage);
          }

          const processingData = await processingResponse.json();
          const stagesData = await stagesResponse.json();

          setProcessData(processingData.length > 0 ? processingData[0] : {});
          setStagesData(stagesData);
          setError(null);
        } catch (error) {
          console.error("Error fetching data:", error.message);
          setError(`Failed to fetch data: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleViewChange = (event) => {
    setViewType(event.target.value);
  };

  const handleFetchAndView = () => {
    if (selectedDate) {
      setViewType(viewType);
    }
  };

  const handleExportPDF = async () => {
    const input = document.getElementById("dashboard-content");
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("cashew-nut-dashboard.pdf");
    }
  };

  const handleSendEmail = () => {
    console.log("Email functionality is not implemented yet.");
  };

  const handleExportData = () => {
    console.log("Export functionality is not implemented yet.");
  };

  const calculateEfficiency = (input, output, lossThreshold) => {
    const safeInput = input || 0;
    const safeOutput = output || 0;
    const safeLossThreshold = lossThreshold || 0;

    const total = safeInput;
    const realized = safeOutput;
    const expected = total * (1 - safeLossThreshold / 100);

    return { total, realized, expected };
  };

  const defaultStagesData = {
    boilingSteaming: 0,
    grading: 0,
    cutting: 0, // Added cutting stage
    primaryShelling: 0,
    secondaryShelling: 0,
    bormaDrying: 0,
    cooling: 0, // Cooling comes after borma drying
    peeling: 0,
    sweating: 0,
    sorting: 0,
    packaging: 0,
  };

  const defaultProcessData = {
    boilingSteamingInput: 0,
    packagingOutput: 0,
    boilingSteamingOutput: 0,
  };

  const overallEfficiency = calculateEfficiency(
    processData?.boilingSteamingInput ||
      defaultProcessData.boilingSteamingInput,
    processData?.packagingOutput || defaultProcessData.packagingOutput,
    (stagesData?.boilingSteaming || defaultStagesData.boilingSteaming) +
      (stagesData?.grading || defaultStagesData.grading) +
      (stagesData?.cutting || defaultStagesData.cutting) + // New stage added here
      (stagesData?.primaryShelling || defaultStagesData.primaryShelling) +
      (stagesData?.secondaryShelling || defaultStagesData.secondaryShelling) +
      (stagesData?.bormaDrying || defaultStagesData.bormaDrying) +
      (stagesData?.cooling || defaultStagesData.cooling) + // Cooling now placed after borma drying
      (stagesData?.peeling || defaultStagesData.peeling) +
      (stagesData?.sweating || defaultStagesData.sweating) +
      (stagesData?.sorting || defaultStagesData.sorting) +
      (stagesData?.packaging || defaultStagesData.packaging)
  );

  return (
    <div className="flex ml-36 h-screen">
      <div className="flex-1 p-8" style={{ maxWidth: "70%" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Cashew Nut Processing Efficiency
            </h1>
            <p>
              View the performance of different stages in cashew nut processing,
              including total input, expected output, and realized output.
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
            className="bg-white p-2 rounded border-2 border-black text-black"
          />
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="view"
                value="Charts"
                className="mr-2"
                checked={viewType === "Charts"}
                onChange={handleViewChange}
              />
              Charts
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="view"
                value="Numbers"
                className="mr-2"
                checked={viewType === "Numbers"}
                onChange={handleViewChange}
              />
              Numbers
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="view"
                value="Both"
                className="mr-2"
                checked={viewType === "Both"}
                onChange={handleViewChange}
              />
              Both
            </label>
          </div>
          <button
            className="ml-4 bg-gray-800 p-2 rounded hover:bg-gray-700 text-white"
            onClick={handleFetchAndView}
          >
            Go
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading &&
          !error &&
          (viewType === "Charts" || viewType === "Both") && (
            <>
              <BarGraph title="Overall Efficiency" {...overallEfficiency} />
              {Object.keys(defaultStagesData).map((stage) => (
                <BarGraph
                  key={stage}
                  title={stage.replace(/([A-Z])/g, " $1")}
                  {...calculateEfficiency(
                    processData?.[`${stage}Input`] || 0,
                    processData?.[`${stage}Output`] || 0,
                    stagesData?.[stage] || 0
                  )}
                />
              ))}
            </>
          )}
      </div>

      <div className="flex flex-col items-center justify-start p-4 space-y-4">
        <img
          src={PdfIcon}
          alt="PDF Export"
          className="w-14 h-14 cursor-pointer"
          onClick={handleExportPDF}
        />
        <img
          src={MailIcon}
          alt="Send Email"
          className="w-14 h-14 cursor-pointer"
          onClick={handleSendEmail}
        />
        <img
          src={ExportIcon}
          alt="Export Data"
          className="w-14 h-14 cursor-pointer"
          onClick={handleExportData}
        />
      </div>

      <div className="fixed right-0 bg-gray-50 w-[15%] h-full p-2 text-sm leading-tight">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <p>1. The default dashboard value is available at the latest date.</p>
        <p>
          2. The values can be viewed in charts, numbers, or both as per user
          preference.
        </p>
        <p>3. Green indicates the expected value.</p>
        <p>4. Red indicates the realized loss.</p>
        <p>5. Grey indicates the total input.</p>
        <p>
          6. Clicking the PDF icon allows you to download the dashboard as a
          PDF.
        </p>
        <p>7. Clicking the Mail icon allows you to email the dashboard PDF.</p>
      </div>
    </div>
  );
};

export default CashewNutDashboard;
