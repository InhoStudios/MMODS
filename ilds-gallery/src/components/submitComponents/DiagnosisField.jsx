import React from "react";

export default class DiagnosisField extends React.Component {

    render() {
        return (
            <>
                <div class="hidden-passthrough" id="entityDefinition">
                    <h5>{this.props.entity.title["@value"]}</h5>
                    <h6>{this.props.entity["@id"]}</h6>
                    <p>{
                        this.props.entity?.definition ? this.props.entity.definition["@value"] : ""
                    }</p>
                </div>
                <label>
                    Disease Severity
                    <div className="row mb-3">
                        <div className="form-group">
                            <select class="form-control form-control-lg" name="severity" id="severity"
                                onChange={this.props.updateSeverity}
                                required>
                                <option value="" selected disabled hidden>Benign or Malignant ↓</option>
                                <option value="b">Benign</option>
                                <option value="m">Malignant</option>
                            </select>
                        </div>
                    </div>
                </label>
                {/* <label>
                    DIfficulty of Diagnosis
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <input className="form-control-lg col-lg-12" type="range" min="1"
                                    max="5" defaultValue="3" id="easeofdiag" name="easeofdiag" 
                                    onChange={this.props.updateDod}/>
                        </div>
                    </div>
                </label> */}
                <label htmlFor="size">
                    Lesion Size (mm)
                    <div className="mb-3 row">
                        <div className="form-group">
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