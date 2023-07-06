import React from "react";
import { SERVER_ENDPOINT } from "../utilities/Structures";

export default class DownloadBar extends React.Component {

    async download(e) {
        e.preventDefault()
        // let images = await fetch(`${SERVER_ENDPOINT}/image/download`)
        //     .then((data) => {
        //         var a = document.createElement("a");
        //         a.href = `${SERVER_ENDPOINT}/image/download`;
        //         a.download = "FILENAME";
        //         a.click();
        //     });
        window.location.assign(`${SERVER_ENDPOINT}/image/download`)
        // return await fetch(`${SERVER_ENDPOINT}/image/download`)
    }

    render() {
        return (
            <section className="mt-5">
                <div className="container-fluid download-bar" id="downloadbar">
                    <div className="col-lg-12">
                        <div className="card card-shadow">
                            <div className="card-body">
                                <form method="post" enctype="multipart/form-data">
                                    <div className="mt-3 row">
                                        <div className="col-lg-8">
                                            <h4 className="d-inline-block px-4" id="downloadbartxt"></h4>
                                            <p className="d-inline-block">Save metadata as </p>
                                            <input type="radio" className="d-inline-block form-check-input" name="metaformat" value="csv" />
                                            <p className="d-inline-block"><b>.csv</b></p>
                                            <input type="radio" className="d-inline-block form-check-input" name="metaformat" value="json" checked />
                                            <p className="d-inline-block"><b>.json</b></p>
                                        </div>
                                        <div className="col-lg-4">
                                            <input type="submit" className="form-control form-control-lg btn btn-success btn-lg" 
                                                id="verify" 
                                                name="verify" 
                                                value="Download" 
                                                onClick={this.download} />
                                        </div>
                                    </div>
                                    <div className="hidden-passthrough">
                                        <input type="input" className="form-control form-control-lg" id="filelist" name="filelist" value="" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}