import React from "react";
import { Route, Routes } from "react-router-dom";
import CashewDashboard from "./CashewDashboard";
import CashewData from "./CashewData";
import CashewHome from "./CashewHome";
import CashewInsights from "./CashewInsights";
import CashewNutMenu from "./CashewMenu";
import Reports from "./CashewReports";

const CashewWorkbench = () => {
  return (
    <div className="flex-1 mt-16 ml-20 ">
      <CashewNutMenu />
      <div className="">
        <Routes>
          <Route index element={<CashewHome />} />
          <Route path="home" element={<CashewHome />} />
          <Route path="dashboard" element={<CashewDashboard />} />
          <Route path="insights" element={<CashewInsights />} />
          <Route path="data" element={<CashewData />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </div>
      {}
    </div>
  );
};

export default CashewWorkbench;
