import React from "react";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
    render() {
        return (
            <div class="container-fluid" style="width:100%">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <a class="navbar-brand text-left" href="/">ICD-Database</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class=" text-right">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/quiz">Quiz</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/submit">Submit</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/verify">Verify</a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;