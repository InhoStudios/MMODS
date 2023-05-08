import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default class Layout extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <Outlet />
            </>
        );
    }
}
