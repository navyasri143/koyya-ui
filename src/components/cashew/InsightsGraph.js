import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const InsightsGraph = ({
  overallEfficiencyData,
  lossData,
  stagesDataList,
  processDataList,
  cumulativeOverallData,
  cumulativeStageData,
  hasData,
  processDates,
  lowestEfficiencyStage,
}) => {
  // Function to calculate efficiency as a percentage
  const calculateEfficiency = (input, output, lossThreshold) => {
    const safeInput = input || 0;
    const safeOutput = output || 0;
    const safeLossThreshold = lossThreshold || 0;

    const total = safeInput;
    const realized = safeOutput;
    const expected = total * (1 - safeLossThreshold / 100);

    return { total, realized, expected };
  };

  // Function to get default efficiency percentage
  const getDefaultEfficiency = (data) =>
    data.total !== 0 ? (data.realized / data.total) * 100 : 0;

  // Function to render date in DD-MM-YYYY format
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // DD-MM-YYYY format
  };

  // Prepare the data for the graph
  const overallEfficiency = getDefaultEfficiency({
    total: cumulativeOverallData?.input || 0, // Safe access
    realized: cumulativeOverallData?.output || 0, // Safe access
    expected: cumulativeOverallData?.input * (1 - 0.1), // Assuming 10% loss threshold, safe access
  });

  const cumulativeEfficiencyData = [
    {
      name: "Overall",
      efficiency: overallEfficiency,
    },
  ];

  // Add individual process data to graph data
  processDataList.forEach((processData, index) => {
    cumulativeEfficiencyData.push({
      name: formatDate(processDates[index]),
      efficiency: getDefaultEfficiency(
        calculateEfficiency(
          processData?.boilingSteamingInput || 0, // Safe access
          processData?.packagingOutput || 0, // Safe access
          10
        )
      ),
    });
  });

  // Updated Stage Name Mapping
  const stageNameMapping = {
    boilingSteaming: "Boiling Steaming",
    grading: "Grading",
    cutting: "Cutting", // New Stage Added
    primaryShelling: "Primary Shelling",
    secondaryShelling: "Secondary Shelling",
    cooling: "Cooling", // Renamed from chilling to cooling
    bormaDrying: "Borma Drying",
    peeling: "Peeling",
    sweating: "Sweating",
    sorting: "Sorting",
    packaging: "Packaging",
  };

  return (
    <div className="space-y-8">
      {/* Cumulative Overall Efficiency */}
      <div className="border p-4">
        <h3 className="text-xl font-bold">
          Overall Efficiency ({overallEfficiency.toFixed(2)}%)
        </h3>

        <ResponsiveContainer width="80%" height={250}>
          <BarChart
            data={cumulativeEfficiencyData}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            {/* Reference Line */}
            <ReferenceLine
              y={overallEfficiency}
              stroke="black"
              strokeDasharray="3 3"
            />

            <Bar dataKey="efficiency">
              {/* Add percentage labels above each bar */}
              <LabelList
                dataKey="efficiency"
                position="top"
                formatter={(value) => `${value.toFixed(2)}%`}
              />
              {cumulativeEfficiencyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "blue" // Overall efficiency bar is blue
                      : entry.efficiency >= overallEfficiency
                      ? "green" // Date's efficiency is greater than or equal to overall
                      : "red" // Date's efficiency is less than overall
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4">
          <p>Input: {cumulativeOverallData?.input || 0} Kg</p>
          <p>
            Expected Output: {cumulativeOverallData?.expected?.toFixed(2) || 0}{" "}
            Kg
          </p>
          <p>Realized Output: {cumulativeOverallData?.output || 0} Kg</p>
          <p>
            Loss: {cumulativeOverallData?.loss || 0} Kg (
            {Math.abs(
              cumulativeOverallData?.output - cumulativeOverallData?.expected
            ).toFixed(2)}{" "}
            {cumulativeOverallData?.output > cumulativeOverallData?.expected
              ? "better"
              : "less"}{" "}
            than {cumulativeOverallData?.expected?.toFixed(2)} Kg normal)
          </p>
          <p>
            Loss (%):{" "}
            {(
              (cumulativeOverallData?.loss / cumulativeOverallData?.input) *
                100 || 0
            ).toFixed(2)}{" "}
            % (
            {Math.abs(
              (cumulativeOverallData?.output / cumulativeOverallData?.input) *
                100 -
                (cumulativeOverallData?.expected /
                  cumulativeOverallData?.input) *
                  100 || 0
            ).toFixed(2)}{" "}
            %{" "}
            {cumulativeOverallData?.output > cumulativeOverallData?.expected
              ? "better"
              : "less"}{" "}
            than{" "}
            {(cumulativeOverallData?.expected / cumulativeOverallData?.input) *
              100 || 0}{" "}
            % normal)
          </p>
          <p>
            Efficiency: {overallEfficiency.toFixed(2)}% (
            {Math.abs(
              overallEfficiency -
                (cumulativeOverallData?.expected /
                  cumulativeOverallData?.input) *
                  100
            ).toFixed(2)}{" "}
            %{" "}
            {overallEfficiency >
            (cumulativeOverallData?.expected / cumulativeOverallData?.input) *
              100
              ? "better"
              : "less"}{" "}
            than{" "}
            {(
              (cumulativeOverallData?.expected / cumulativeOverallData?.input) *
              100
            ).toFixed(2)}{" "}
            % normal)
          </p>
          <p>
            Major Concern: Efficiency in {lowestEfficiencyStage} stage is below
            the desired threshold.
          </p>
        </div>
      </div>

      {/* Stage-specific Efficiency Graphs */}
      {Object.keys(stagesDataList[0] || {}).map((stage) => {
        const stageEfficiencyData = [
          {
            name: "Overall",
            efficiency: getDefaultEfficiency({
              total: cumulativeStageData[stage]?.input || 0,
              realized: cumulativeStageData[stage]?.realized || 0,
              expected: cumulativeStageData[stage]?.expected || 0,
            }),
          },
        ];

        processDataList.forEach((processData, index) => {
          const input = processData?.[`${stage}Input`] || 0;
          const output = processData?.[`${stage}Output`] || 0;
          const lossThreshold = stagesDataList?.[index]?.[stage] || 0;
          const efficiency = getDefaultEfficiency(
            calculateEfficiency(input, output, lossThreshold)
          );

          stageEfficiencyData.push({
            name: formatDate(processDates[index]),
            efficiency,
          });
        });

        const stageOverallEfficiency = getDefaultEfficiency({
          total: cumulativeStageData[stage]?.input || 0,
          realized: cumulativeStageData[stage]?.realized || 0,
          expected: cumulativeStageData[stage]?.expected || 0,
        });

        return (
          <div key={stage} className="border p-4">
            <h3 className="text-xl font-bold">
              {stageNameMapping[stage] || stage} Efficiency (
              {stageOverallEfficiency.toFixed(2)}%)
            </h3>

            <ResponsiveContainer width="80%" height={250}>
              <BarChart
                data={stageEfficiencyData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                barSize={25}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                {/* Reference Line for stage-specific */}
                <ReferenceLine
                  y={stageOverallEfficiency}
                  stroke="black"
                  strokeDasharray="3 3"
                />

                <Bar dataKey="efficiency">
                  {/* Add percentage labels above each bar */}
                  <LabelList
                    dataKey="efficiency"
                    position="top"
                    formatter={(value) => `${value.toFixed(2)}%`}
                  />
                  {stageEfficiencyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "blue" // Overall efficiency bar is blue
                          : entry.efficiency >= stageOverallEfficiency
                          ? "green" // Date's efficiency is greater than or equal to stage overall
                          : "red" // Date's efficiency is less than stage overall
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4">
              <p>Input: {cumulativeStageData[stage]?.input || 0} Kg</p>
              <p>
                Expected Output:{" "}
                {cumulativeStageData[stage]?.expected?.toFixed(2) || 0} Kg
              </p>
              <p>
                Realized Output: {cumulativeStageData[stage]?.realized || 0} Kg
              </p>
              <p>
                Loss: {cumulativeStageData[stage]?.loss || 0} Kg (
                {Math.abs(
                  cumulativeStageData[stage]?.realized -
                    cumulativeStageData[stage]?.expected
                ).toFixed(2)}{" "}
                {cumulativeStageData[stage]?.realized >
                cumulativeStageData[stage]?.expected
                  ? "better"
                  : "less"}{" "}
                than {cumulativeStageData[stage]?.expected?.toFixed(2)} Kg
                normal)
              </p>
              <p>
                Loss (%):{" "}
                {(cumulativeStageData[stage]?.lossPercent || 0).toFixed(2)}% (
                {Math.abs(
                  (cumulativeStageData[stage]?.realized /
                    cumulativeStageData[stage]?.input) *
                    100 -
                    (cumulativeStageData[stage]?.expected /
                      cumulativeStageData[stage]?.input) *
                      100 || 0
                ).toFixed(2)}{" "}
                %{" "}
                {cumulativeStageData[stage]?.realized >
                cumulativeStageData[stage]?.expected
                  ? "better"
                  : "less"}{" "}
                than{" "}
                {(cumulativeStageData[stage]?.expected /
                  cumulativeStageData[stage]?.input) *
                  100 || 0}{" "}
                % normal)
              </p>
              <p>
                Efficiency: {stageOverallEfficiency.toFixed(2)}% (
                {Math.abs(
                  stageOverallEfficiency -
                    (cumulativeStageData[stage]?.expected /
                      cumulativeStageData[stage]?.input) *
                      100
                ).toFixed(2)}{" "}
                %{" "}
                {stageOverallEfficiency >
                (cumulativeStageData[stage]?.expected /
                  cumulativeStageData[stage]?.input) *
                  100
                  ? "better"
                  : "less"}{" "}
                than{" "}
                {(
                  (cumulativeStageData[stage]?.expected /
                    cumulativeStageData[stage]?.input) *
                  100
                ).toFixed(2)}{" "}
                % normal)
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightsGraph;
