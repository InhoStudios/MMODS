import React from "react";
import './css/App.css';
import './css/index.css';
import './css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Verify from "./pages/Verify";
export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home/>} />
                        <Route path="submit" element={<Submit/>}/>
                        <Route path="verify" element={<Verify/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

