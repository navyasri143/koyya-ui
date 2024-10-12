import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ReportTable from "./ReportTable";

// Import button icons
import ExportIcon from "../images/Export button.png";
import MailIcon from "../images/Mail icon.png";
import PdfIcon from "../images/PDF icon.png";

// Utility function to format date to YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get the date 30 days ago
const getLastMonthDate = () => {
  const today = new Date();
  const lastMonth = new Date(today.setDate(today.getDate() - 30));
  return formatDate(lastMonth);
};


const CashewReports = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(getLastMonthDate());
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [selectedStage, setSelectedStage] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   
  const sendEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const sleekId = localStorage.getItem("sleekId");
  
      if (!token || !sleekId) {
        setError("Sleek ID or token not found. Please log in again.");
        return;
      }
  
      const emailApiUrl = `http://localhost:8080/api/${sleekId}/send-email`;
  
      const emailData = {
        to: localStorage.getItem("email"), // Replace with the desired recipient email
        subject: "Cashew Processing Report",
        text: setData,
      };
  
      await axios.post(emailApiUrl, emailData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      setError(""); // Clear any previous error
      alert("Email sent successfully!");
    } catch (error) {
      setError(
        `Failed to send email: ${
          error.response?.status === 404 ? "API endpoint not found" : error.message
        }`
      );
    }
  };

  // Updated stage order to match the backend structure
  const stages = [
    { value: "all", label: "All Stages" },
    { value: "overallEfficiency", label: "Overall Efficiency" },
    { value: "boilingSteamingInput", label: "Boiling/Steaming" },
    { value: "gradingInput", label: "Grading" },
    { value: "cuttingInput", label: "Cutting" }, // New Cutting stage
    { value: "primaryShellingInput", label: "Primary Shelling" },
    { value: "secondaryShellingInput", label: "Secondary Shelling" },
    { value: "bormaDryingInput", label: "Borma Drying" },
    { value: "coolingInput", label: "Cooling" }, // Updated "Cooling" stage
    { value: "peelingInput", label: "Peeling" },
    { value: "sweatingInput", label: "Sweating" },
    { value: "sortingInput", label: "Sorting" },
    { value: "packagingInput", label: "Packaging" },
  ];

  // Fetch data on component mount for last 30 days
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Start date or end date is missing!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Retrieve the JWT token and sleekId from localStorage
      const token = localStorage.getItem("token");
      const sleekId = localStorage.getItem("sleekId");

      if (!token || !sleekId) {
        setError("Sleek ID or token not found. Please log in again.");
        return;
      }

      const apiUrl = `http://localhost:8080/api/${sleekId}/processing/reports`; // Backend API

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass JWT in Authorization header
        },
        params: {
          startDate,
          endDate,
        },
      });

      if (response.data.length > 0) {
        setData(response.data);
      } else {
        setError("No data found for the selected date range.");
        setData([]);
      }
    } catch (error) {
      setError(
        `Failed to fetch data: ${
          error.response?.status === 404
            ? "API endpoint not found"
            : error.message
        }`
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    setData([]);
    fetchData();
  };

  const processStageData = (stageInput, stageOutput) => {
    let cumulativeInput = 0;
    let cumulativeOutput = 0;
    let cumulativeLoss = 0;

    return data.map((entry, index) => {
      const stageInputValue = entry[stageInput] ?? 0;
      const stageOutputValue = entry[stageOutput] ?? 0;

      const loss = stageInputValue - stageOutputValue;
      cumulativeInput += stageInputValue;
      cumulativeOutput += stageOutputValue;
      cumulativeLoss += loss;

      const averageLoss = cumulativeLoss / (index + 1);

      return {
        serialNumber: index + 1,
        date: new Date(entry.date).toLocaleDateString("en-GB"),
        input: stageInputValue,
        output: stageOutputValue,
        loss: loss,
        totalInput: cumulativeInput,
        totalLoss: cumulativeLoss,
        averageLoss: averageLoss,
        totalOutput: cumulativeOutput,
      };
    });
  };

  const processOverallEfficiencyData = () => {
    let cumulativeInput = 0;
    let cumulativeOutput = 0;
    let cumulativeLoss = 0;

    return data.map((entry, index) => {
      const totalInput = entry.boilingSteamingInput ?? 0;
      const totalOutput = entry.packagingOutput ?? 0;
      const loss = totalInput - totalOutput;

      cumulativeInput += totalInput;
      cumulativeOutput += totalOutput;
      cumulativeLoss += loss;

      const averageLoss = cumulativeLoss / (index + 1);

      return {
        serialNumber: index + 1,
        date: new Date(entry.date).toLocaleDateString("en-GB"),
        input: totalInput,
        output: totalOutput,
        loss: loss,
        totalInput: cumulativeInput,
        totalLoss: cumulativeLoss,
        averageLoss: averageLoss,
        totalOutput: cumulativeOutput,
      };
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Cashew Nut Processing Report", 20, 10);

    // Export Overall Efficiency data
    doc.autoTable({
      head: [
        [
          "#",
          "Date",
          "Input",
          "Output",
          "Loss",
          "Total Input",
          "Total Loss",
          "Average Loss",
          "Total Output",
        ],
      ],
      body: processOverallEfficiencyData().map((item) => [
        item.serialNumber,
        item.date,
        item.input,
        item.output,
        item.loss,
        item.totalInput,
        item.totalLoss,
        item.averageLoss.toFixed(2),
        item.totalOutput,
      ]),
      startY: 20,
    });
    
    // Export Stage data
    stages.slice(2).forEach((stage, index) => {
      doc.addPage();
      doc.text(stage.label, 20, 10);
      doc.autoTable({
        head: [
          [
            "#",
            "Date",
            "Input",
            "Output",
            "Loss",
            "Total Input",
            "Total Loss",
            "Average Loss",
            "Total Output",
          ],
        ],
        body: processStageData(
          stage.value,
          stage.value.replace("Input", "Output")
        ).map((item) => [
          item.serialNumber,
          item.date,
          item.input,
          item.output,
          item.loss,
          item.totalInput,
          item.totalLoss,
          item.averageLoss.toFixed(2),
          item.totalOutput,
        ]),
        startY: 20,
      });
    });

    doc.save("Cashew_Processing_Report.pdf");
  };

  // Prepare CSV data for all stages
  const csvData = [
    [
      "#",
      "Date",
      "Stage",
      "Input",
      "Output",
      "Loss",
      "Total Input",
      "Total Loss",
      "Average Loss",
      "Total Output",
    ],
    ...processOverallEfficiencyData().map((item) => [
      item.serialNumber,
      item.date,
      "Overall Efficiency",
      item.input,
      item.output,
      item.loss,
      item.totalInput,
      item.totalLoss,
      item.averageLoss.toFixed(2),
      item.totalOutput,
    ]),
    ...stages
      .slice(2)
      .flatMap((stage) =>
        processStageData(
          stage.value,
          stage.value.replace("Input", "Output")
        ).map((item) => [
          item.serialNumber,
          item.date,
          stage.label,
          item.input,
          item.output,
          item.loss,
          item.totalInput,
          item.totalLoss,
          item.averageLoss.toFixed(2),
          item.totalOutput,
        ])
      ),
  ];

  const today = formatDate(new Date());

  return (
    <div className="flex ml-36 h-screen">
      <div className="flex-1 p-8" style={{ maxWidth: "70%" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Cashew Nut Processing Efficiency
            </h1>
            <p className="text-gray-500 mb-6">
              View your processed data in the form of a report where you can
              select particular stages and all stages together. The data can be
              ranging from days to months and years of entries by choosing the
              starting to ending date.
            </p>
          </div>
        </div>

        {/* Date Pickers */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <label htmlFor="from-date" className="font-medium">
              From
            </label>
            <input
              id="from-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="to-date" className="font-medium">
              To
            </label>
            <input
              id="to-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={handleFetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : "GO"}
          </button>
        </div>

        {/* Error Handling */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Stage Filter Label */}
        <div className="text-center mb-2">
          <label className="font-medium">Stages</label>
        </div>

        {/* Stage Filter Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="border border-gray-300 p-2 rounded-md"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            {stages.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        {/* Render Based on Selected Stage */}
        {selectedStage === "overallEfficiency" ? (
          <ReportTable
            title="Overall Efficiency"
            data={processOverallEfficiencyData()}
          />
        ) : selectedStage === "all" ? (
          <>
            <ReportTable
              title="Overall Efficiency"
              data={processOverallEfficiencyData()}
            />
            {stages.slice(2).map((stage) => (
              <ReportTable
                key={stage.value}
                title={stage.label}
                data={processStageData(
                  stage.value,
                  stage.value.replace("Input", "Output")
                )}
              />
            ))}
          </>
        ) : (
          <ReportTable
            title={stages.find((stage) => stage.value === selectedStage)?.label}
            data={processStageData(
              selectedStage,
              selectedStage.replace("Input", "Output")
            )}
          />
        )}
      </div>

      {/* Right Side Bar */}
      <div className="fixed right-0 bg-gray-50 w-[15%] h-full p-2 text-sm leading-tight">
        <div className="text-sm text-gray-600">
          <h3 className="font-semibold mt-3 mb-1">Date</h3>
          <p>The user can enter the starting to ending date of their choice.</p>
          <h3 className="font-semibold mt-3 mb-1">Stages</h3>
          <p>
            The user can select a particular set of stages predetermined during
            activation of the commodity. They can also view all stages together
            by selecting one option.
          </p>
          <h3 className="font-semibold mt-3 mb-1">PDF</h3>
          <p>
            The report can be printed or posted as a PDF copy by clicking on the
            PDF icon.
          </p>
          <h3 className="font-semibold mt-3 mb-1">Mail</h3>
          <p>The report can be mailed to the registered email ID.</p>
          <h3 className="font-semibold mt-3 mb-1">Export</h3>
          <p>The input data for the report can be exported to a CSV file.</p>
        </div>
      </div>

      {/* PDF, Mail, and Export Icons */}
      <div className="flex flex-col items-center justify-start p-4 space-y-4">
        <img
          src={PdfIcon}
          alt="PDF Export"
          className="w-14 h-14 cursor-pointer"
          onClick={exportToPDF}
        />
        <img
          src={MailIcon}
          alt="Send Email"
          className="w-14 h-14 cursor-pointer"
          onClick={sendEmail}
        />
        <CSVLink data={csvData} filename={"cashew_report.csv"}>
          <img
            src={ExportIcon}
            alt="Export Data"
            className="w-14 h-14 cursor-pointer"
          />
        </CSVLink>
      </div>
    </div>
  );
};

export default CashewReports;
