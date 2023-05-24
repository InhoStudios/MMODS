import React from "react";
import ImageCard from "../components/ImageCard";

export default class Verify extends React.Component {
    render() {
        return (

            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1>Images</h1>
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="dropdown px-2">
                                <button className="btn btn-outline-secondary">Severity ↓</button>
                                <div className="dropdown-content">
                                    <a href="#benign">Benign Lesions</a>
                                    <a href="#malignant">Malignant Lesions</a>
                                </div>
                            </div>
                            <div className="dropdown px-2">
                                <button className="btn btn-outline-secondary">Image Type ↓</button>
                                <div className="dropdown-content">
                                    <a href="#clinical">Clinical</a>
                                    <a href="#dermoscopy">Dermoscopy</a>
                                </div>
                            </div>
                            <div className="dropdown px-2">
                                <button className="btn btn-outline-secondary">ICD Class ↓</button>
                                <div className="dropdown-content">
                                    <a href="#entrycard">All diagnoses</a>
                                    {/*{% for key in categories.keys() %}*/}
                                    {/*<a href="#{{ key }}">{{categories[key]}}</a>*/}
                                    {/*{% endfor %}*/}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <form method="post">
                                <input type="input" className="form-control form-control-lg" placeholder="Search" />
                            </form>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-10 mb-2 text-left">
                            <div className="row mt-5">
                                <ImageCard
                                    filepath={"logo192.png"}
                                    uri={12345}
                                    title={"test diagnosis"}
                                    colsize={"col-lg-3"}/>
                                <ImageCard
                                    filepath={"logo192.png"}
                                    uri={12345}
                                    title={"test diagnosis"}
                                    colsize={"col-lg-3"}/>
                                <ImageCard
                                    filepath={"logo192.png"}
                                    uri={12345}
                                    title={"test diagnosis"}
                                    colsize={"col-lg-3"}/>
                                <ImageCard
                                    filepath={"logo192.png"}
                                    uri={12345}
                                    title={"test diagnosis"}
                                    colsize={"col-lg-3"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}