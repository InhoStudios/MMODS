import React from "react";
import './css/App.css';
import './css/index.css';
import './css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ICDManager from "./utilities/ICDManager";
import Submit from "./pages/Submit";
import Verify from "./pages/Verify";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.icdManager = new ICDManager();
    }
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home manager={this.icdManager}/>} />
                        <Route path="submit" element={<Submit manager={this.icdManager}/>} />
                        <Route path="verify" element={<Verify manager={this.icdManager}/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

