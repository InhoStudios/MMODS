import React from "react";

export default class PatientInfoField extends React.Component {
    render() {
        return (
            <>
                <h4 className="mb-3">Patient Information</h4>
                <label htmlFor="age">
                    Age
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <input type="number" className="form-control form-control-lg" id="age"
                                name="age" placeholder="Age" 
                                onChange={this.props.updateAge}/>
                        </div>
                    </div>
                </label>
                <label>
                    Assigned Sex
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <select class="form-control form-control-lg" name="severity" id="severity">
                                <option value="null" selected disabled hidden>Choose patient declared sex</option>
                                <option value="f">Female</option>
                                <option value="m">Male</option>
                            </select>
                        </div>
                    </div>
                </label>
                <label>
                    Does the patient have a family history of this condition?
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <select class="form-control form-control-lg" name="severity" id="severity">
                                <option value="f" selected>No, the patient does not have a family history of this condition</option>
                                <option value="t">Yes, the patient has a family history of this condition</option>
                            </select>
                        </div>
                    </div>
                </label>
            </>
        )
    }
}