import React from "react";
import ImageUploadField from "../components/submitComponents/ImageUploadField";
import PatientInfoField from "../components/submitComponents/PatientInfoField";
import DiagnosisField from "../components/submitComponents/DiagnosisField";

export default class Submit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1>Submit image</h1>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-10 mb-2 text-left">

                            <div className="row">

                                <form method="post" encType="multipart/form-data">
                                    <div className="row mb-5">
                                        <h4 className="mb-3">Search ICD-11 (ICDD) diagnosis</h4>
                                        <div className="form-group mb-3">
                                            <input type="input" className="form-control form-control-lg" id="search"
                                                   name="search" placeholder="Search Diagnosis" value="{{ query }}" />
                                            <input type="submit" className="hidden-passthrough" name="submit"
                                                   value="Search" />
                                        </div>
                                    </div>
                                    <div className="row {{ hideclass }} mb-5">
                                        <DiagnosisField />
                                        <PatientInfoField />
                                        <ImageUploadField />
                                    </div>
                                    <div className="row mb-5">
                                        <div className="form-group mb-3">
                                            <input type="submit"
                                                   className="form-control form-control-lg btn btn-outline-primary btn-lg {{ hideclass }}"
                                                   id="upload_button" value="Upload" name="submit" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}