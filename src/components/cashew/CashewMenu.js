import React from "react";
import { Link } from "react-router-dom";

const CashewNutMenu = () => {
  return (
    <div className="w-36 bg-green-200 fixed h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Cashew Nut</h2>
        <ul>
          <li className="mb-2">
            <Link to="home">
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link to="dashboard">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="insights">
              Insights
            </Link>
          </li>
          <li className="mb-2">
            <Link to="data">
              Data
            </Link>
          </li>
          <li className="mb-2">
            <Link to="reports">
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashewNutMenu;
