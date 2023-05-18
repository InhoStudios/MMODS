import React from "react";

export default class DiagnosisField extends React.Component {

    render() {
        return (
            <>
                <div class="row">
                    <h5>{this.props.entity.title["@value"]}</h5>
                    <h6>{this.props.entity["@id"]}</h6>
                    <p>{
                        this.props.entity?.definition ? this.props.entity.definition["@value"] : ""
                    }</p>
                </div>
                <h4 className="mb-3">Diagnosis information</h4>
                <label>
                    Disease Severity
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <div className="form-control-lg form-control" onChange={this.props.updateSeverity}>
                                <label className="col-lg-6" htmlFor="benign">
                                    <input type="radio" className="form-check-input" id="benign"
                                        name="presentation" value="benign" />
                                    Benign
                                </label>
                                <label className="col-lg-6" htmlFor="malignant">
                                    <input type="radio" className="form-check-input" id="malignant"
                                        name="presentation" value="malignant" />
                                    Malignant
                                </label>
                            </div>
                        </div>
                    </div>
                </label>
                <label>
                    DIfficulty of Diagnosis
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <input className="form-control-lg col-lg-12" type="range" min="1"
                                    max="5" defaultValue="3" id="easeofdiag" name="easeofdiag" 
                                    onChange={this.props.updateDod}/>
                        </div>
                    </div>
                </label>
                <label htmlFor="size">
                    Lesion Size (mm)
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <input type="number" className="form-control form-control-lg" id="size"
                                    name="size" placeholder="Lesion size (mm)" 
                                    onChange={this.props.updateSize}/>
                        </div>
                    </div>
                </label>
            </>
        )
    }
}