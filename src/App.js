// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Workspace from "./components/Workspace";
import DefaultWorkbench from "./components/DefaultWorkbench";
import SettingsWorkbench from "./components/settings/SettingsWorkbench";
import CashewWorkbench from "./components/cashew/CashewWorkbench";
import LoginPage from "./components/login/LoginPage";
import RegistrationForm from "./components/login/RegistrationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/*<Route index element={<DefaultWorkbench />} />*/}
        <Route path="/login/*" element={<LoginPage />}></Route>
        <Route path="/register/*" element={<RegistrationForm />}></Route>
        <Route path="/workspace" element={<Workspace />}>
          <Route path="settings/*" element={<SettingsWorkbench />}></Route>
          <Route path="cashew/*" element={<CashewWorkbench />}></Route>
        </Route>
        {/*</Route>*/}
      </Routes>
    </Router>
  );
}

export default App;
