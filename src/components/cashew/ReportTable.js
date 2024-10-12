import React from "react";

const ReportTable = ({ title, data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">#</th> {/* Serial Number */}
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Input</th>
            <th className="py-2 px-4 border-b">Output</th>
            <th className="py-2 px-4 border-b">Loss</th>
            <th className="py-2 px-4 border-b">Total Input</th>
            <th className="py-2 px-4 border-b">Total Loss</th>
            <th className="py-2 px-4 border-b">Average Loss</th>
            <th className="py-2 px-4 border-b">Total Output</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.serialNumber}>
              <td className="py-2 px-4 border-b">{row.serialNumber}</td>{" "}
              {/* Serial Number */}
              <td className="py-2 px-4 border-b">{row.date}</td>
              <td className="py-2 px-4 border-b">{row.input}</td>
              <td className="py-2 px-4 border-b">{row.output}</td>
              <td className="py-2 px-4 border-b">{row.loss}</td>
              <td className="py-2 px-4 border-b">{row.totalInput}</td>
              <td className="py-2 px-4 border-b">{row.totalLoss}</td>
              <td className="py-2 px-4 border-b">{row.averageLoss}</td>
              <td className="py-2 px-4 border-b">{row.totalOutput}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
