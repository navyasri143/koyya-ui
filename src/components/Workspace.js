import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Banner from '../components/main/Banner';
import NavigationBar from "../components/main/NavigationBar";

const Workspace = () => {
    return (
        <>
            <NavigationBar />
            <Banner workspaceName={"Navayuva Agro"} subscriptionId={"asdf"} />
            <Outlet />
        </>
    );
};

export default Workspace;