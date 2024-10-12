import React, { useCallback, useEffect, useState } from "react";
import ExportIcon from "../images/Export button.png";
import MailIcon from "../images/Mail icon.png";
import PdfIcon from "../images/PDF icon.png";
import InsightsGraph from "./InsightsGraph";

// Define utility functions to calculate efficiency and loss percentage
const calculateEfficiency = (input, output, lossThreshold) => {
  const safeInput = input || 0;
  const safeOutput = output || 0;
  const safeLossThreshold = lossThreshold || 0;

  const total = safeInput;
  const realized = safeOutput;
  const expected = total * (1 - safeLossThreshold / 100);

  return { total, realized, expected };
};

const calculateLossPercentage = (input, output) => {
  const loss = input - output;
  return (loss / input) * 100;
};

const CashewInsights = () => {
  const [processDataList, setProcessDataList] = useState([]);
  const [stagesDataList, setStagesDataList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cumulativeOverallData, setCumulativeOverallData] = useState({});
  const [cumulativeStageData, setCumulativeStageData] = useState({});
  const [lowestEfficiencyStage, setLowestEfficiencyStage] = useState("");

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Set default startDate to one month ago and endDate to today
  useEffect(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setStartDate(oneMonthAgo.toISOString().split("T")[0]);
    setEndDate(today);
  }, [today]);

  // Retrieve JWT token and sleekId from localStorage for authenticated requests
  const getToken = () => localStorage.getItem("token");
  const getSleekId = () => localStorage.getItem("sleekId");

  // Memoized handleFetchData to avoid the warning
  const handleFetchData = useCallback(async () => {
    if (startDate && endDate) {
      setLoading(true);
      try {
        const token = getToken();
        const sleekId = getSleekId();

        if (!token || !sleekId) {
          setError("Sleek ID or token not found. Please log in again.");
          return;
        }

        // Fetch processing and stages data with token-based authorization
        const processingResponse = await fetch(
          `http://localhost:8080/api/${sleekId}/processing/reports?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
            },
          }
        );
        const stagesResponse = await fetch(
          `http://localhost:8080/api/${sleekId}/commodities/process-stages`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
            },
          }
        );

        if (!processingResponse.ok || !stagesResponse.ok) {
          throw new Error(
            `Processing API status: ${processingResponse.status} ${processingResponse.statusText}, Stages API status: ${stagesResponse.status} ${stagesResponse.statusText}`
          );
        }

        const processingData = await processingResponse.json();
        const stagesData = await stagesResponse.json();

        // Store fetched data
        setProcessDataList(processingData || []);
        setStagesDataList(Array(processingData.length).fill(stagesData || {}));
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please select a valid date range.");
    }
  }, [startDate, endDate]); // Only re-create when startDate or endDate changes

  useEffect(() => {
    if (startDate && endDate) {
      handleFetchData(); // Auto-fetch data on mount with default date range
    }
  }, [startDate, endDate, handleFetchData]);

  useEffect(() => {
    if (processDataList.length > 0 && stagesDataList.length > 0) {
      // Calculate cumulative data
      const cumulativeOverallData = processDataList.reduce(
        (acc, processData) => {
          const input = processData?.boilingSteamingInput || 0;
          const output = processData?.packagingOutput || 0;
          acc.input += input;
          acc.output += output;
          return acc;
        },
        { input: 0, output: 0, loss: 0 }
      );

      // Calculate expected output as the sum of loss thresholds across stages (same as the dashboard)
      const totalLossThreshold = Object.keys(stagesDataList[0] || {}).reduce(
        (acc, stage) => acc + (stagesDataList[0][stage] || 0),
        0
      );

      cumulativeOverallData.expected =
        cumulativeOverallData.input * (1 - totalLossThreshold / 100);

      cumulativeOverallData.loss =
        cumulativeOverallData.input - cumulativeOverallData.output;

      const cumulativeStageData = {};
      let lowestEfficiency = Number.POSITIVE_INFINITY;

      Object.keys(stagesDataList[0] || {}).forEach((stage) => {
        cumulativeStageData[stage] = processDataList.reduce(
          (acc, processData) => {
            const input = processData[`${stage}Input`] || 0;
            const output = processData[`${stage}Output`] || 0;
            const lossThreshold = stagesDataList[0][stage] || 0;
            acc.input += input;
            acc.realized += output;
            acc.expected = acc.input * (1 - lossThreshold / 100);
            acc.loss = acc.input - acc.realized;
            acc.lossPercent = (acc.loss / acc.input) * 100;
            acc.normalLoss = acc.input * (lossThreshold / 100); // Calculate normal loss
            acc.normalLossPercent = lossThreshold; // Normal loss percentage from backend
            return acc;
          },
          {
            input: 0,
            realized: 0,
            expected: 0,
            loss: 0,
            lossPercent: 0,
            normalLoss: 0,
            normalLossPercent: 0,
          }
        );

        // Identify the stage with the lowest efficiency
        const efficiency =
          (cumulativeStageData[stage].realized /
            cumulativeStageData[stage].input) *
            100 || 0;
        if (efficiency < lowestEfficiency) {
          lowestEfficiency = efficiency;
          setLowestEfficiencyStage(stage);
        }
      });

      // Set cumulative data for graph
      setCumulativeOverallData(cumulativeOverallData);
      setCumulativeStageData(cumulativeStageData);
    }
  }, [processDataList, stagesDataList]);

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
  };

  const handleSendEmail = () => {
    console.log("Sending Email...");
  };

  const handleExportData = () => {
    console.log("Exporting Data...");
  };

  return (
    <div className="flex ml-36 h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8" style={{ maxWidth: "70%" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Cashew Nut Processing Insights
            </h1>
            <p>
              Detailed trends and data insights into the cashew nut processing
              stages.
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
            disabled={loading || !startDate || !endDate}
          >
            {loading ? "Loading..." : "GO"}
          </button>
        </div>

        {/* Insights Graph - Only show when there is data */}
        {processDataList.length > 0 && stagesDataList.length > 0 ? (
          <InsightsGraph
            overallEfficiencyData={processDataList.map((processData) =>
              calculateEfficiency(
                processData?.boilingSteamingInput || 0,
                processData?.packagingOutput || 0,
                10
              )
            )}
            lossData={processDataList.map((processData) =>
              calculateLossPercentage(
                processData?.boilingSteamingInput || 0,
                processData?.packagingOutput || 0
              )
            )}
            stagesDataList={stagesDataList}
            processDataList={processDataList}
            cumulativeOverallData={cumulativeOverallData}
            cumulativeStageData={cumulativeStageData}
            hasData={!!startDate && !!endDate}
            processDates={processDataList.map((data) => data.date)}
            lowestEfficiencyStage={lowestEfficiencyStage}
          />
        ) : (
          <p>
            {error ||
              'Please select a valid date range and click "GO" to view data.'}
          </p>
        )}

        {loading && <p>Loading data...</p>}
        {error && <p>{error}</p>}
      </div>

      {/* Icons placed vertically on the right side, between main content and sidebar */}
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

      {/* Sidebar */}
      <div className="fixed right-0 bg-gray-50 w-[15%] h-full p-2 text-sm leading-tight">
        <h2 className="text-xl font-bold mb-4">Insights Details</h2>
        <p>Insights (Support bar):</p>
        <ul className="list-disc ml-4">
          <li>
            The default Insights duration is set to the previous one Month.
          </li>
        </ul>
        <p>Charts:</p>
        <ul className="list-disc ml-4">
          <li>Blue bar indicates the overall processing efficiency.</li>
          <li>
            The dotted grey line indicates the overall efficiency in a
            particular stage.
          </li>
          <li>
            Green bar shows your production in the selected positive and safe
            number.
          </li>
          <li>
            Red bar indicates that your production for the day is less than the
            overall and might need improvement.
          </li>
          <li>
            The percentage indicates the efficiency of the process with
            input-output comparison.
          </li>
        </ul>
        <p>Date:</p>
        <ul className="list-disc ml-4">
          <li>Select the dates from start to end.</li>
          <li>
            You can view insights for a single day by selecting the same date in
            both fields.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashewInsights;
