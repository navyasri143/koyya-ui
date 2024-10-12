import React from "react";

const BarGraph = ({ title, realized, expected, total }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold">
        {title} - {((realized / total) * 100).toFixed(2)}%
      </h3>

      {/* Realized Bar */}
      <div className="flex items-center mb-1">
        <div className="bg-red-500 h-6 w-full relative">
          <div
            className="h-6 bg-green-500 flex justify-between items-center"
            style={{ width: `${(realized / total) * 100}%` }}
          >
            <span className="ml-2 text-sm absolute left-2">{realized} Kg</span>
            <span className="mr-2 text-sm absolute right-2">
              {total - realized} Kg
            </span>
          </div>
        </div>
        <span className="ml-3.5 text-sm">Realized</span>
      </div>

      {/* Expected Bar */}
      <div className="flex items-center mb-1">
        <div className="bg-red-500 h-6 w-full relative">
          <div
            className="h-6 bg-green-500 flex justify-between items-center"
            style={{ width: `${(expected / total) * 100}%` }}
          >
            <span className="ml-2 text-sm absolute left-2">{expected} Kg</span>
            <span className="mr-2 text-sm absolute right-2">
              {total - expected} Kg
            </span>
          </div>
        </div>
        <span className="ml-2 text-sm">Expected</span>
      </div>

      {/* Total Bar */}
      <div className="flex items-center mb-2">
        <div className="bg-gray-500 h-6 w-full relative">
          <div
            className="h-6 bg-gray-400 flex justify-between items-center"
            style={{ width: "100%" }}
          >
            <span className="ml-2 text-sm absolute left-2">{total} Kg</span>
          </div>
        </div>
        <span className="ml-9 text-sm">Total</span>
      </div>
    </div>
  );
};

export default BarGraph;
