import React from "react";

export default class DiagnosisField extends React.Component {

    render() {
        return (
            <>
                <h4 className="mb-3">Diagnosis information</h4>
                <div className="form-group mb-3 row">
                    <div className="col-lg-6">
                        <input type="input" className="form-control form-control-lg" id="uri"
                               name="uri" value={`${this.props.entity.title["@value"]}`} disabled readOnly/>
                    </div>
                    <div className="col-lg-6">
                        <input type="input" className="form-control form-control-lg" id="uri"
                               name="uri" value={`${this.props.entity["@id"]}`} disabled readOnly/>
                    </div>
                </div>
                <div class="row mb-3">
                    <p>{
                        this.props.entity?.definition ? this.props.entity.definition["@value"] : ""
                    }</p>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg">
                        <label className="col-lg-6">
                            Disease Severity:
                        </label>
                        <label className="col-lg-3" htmlFor="benign">
                            <input type="radio" className="form-check-input" id="benign"
                                   name="presentation" value="benign" />
                            Benign
                        </label>
                        <label className="col-lg-2" htmlFor="malignant">
                            <input type="radio" className="form-check-input" id="malignant"
                                   name="presentation" value="malignant" />
                            Malignant
                        </label>
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg row">
                        <div className="col-lg-6">
                            <label htmlFor="easeofdiag">
                                Difficulty of Diagnosis
                            </label>
                        </div>
                        <div className="col-lg-6">
                            <input className="form-control-lg col-lg-12" type="range" min="1"
                                   max="5" defaultValue="3" id="easeofdiag" name="easeofdiag" />
                        </div>
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg row">
                        <div className="col-lg-6">
                            <label htmlFor="easeofdiag">
                                Lesion size
                            </label>
                        </div>
                        <div className="col-lg-6">
                            <input type="number" className="form-control form-control-lg" id="size"
                                   name="size" placeholder="Lesion size (mm)" />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}