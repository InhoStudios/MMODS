import React from "react";

export default class PatientInfoField extends React.Component {
    render() {
        return (
            <div className="row {{ hideclass }} mb-5">
                <h4 className="mb-3">Patient Information</h4>
                <div className="row">
                    <div className="form-group mb-3">
                        <input type="number" className="form-control form-control-lg" id="age"
                               name="age" placeholder="Age" />
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg">
                        <label className="col-lg-6">Assigned sex</label>
                        <label className="col-lg-3" htmlFor="male">
                            <input type="radio" className="form-check-input" id="male"
                                   name="sex" value="m" />
                            Male
                        </label>
                        <label className="col-lg-2" htmlFor="female">
                            <input type="radio" className="form-check-input" id="female"
                                   name="sex" value="f" />
                            Female
                        </label>
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg">
                        <label className="col-lg-6">Does the patient have a family history of
                            this condition?</label>
                        <label className="col-lg-3" htmlFor="histtrue">
                            <input type="radio" className="form-check-input" id="histtrue"
                                   name="history" value="Y" />
                            Yes
                        </label>
                        <label className="col-lg-2" htmlFor="histfalse">
                            <input type="radio" className="form-check-input" id="histfalse"
                                   name="history" value="N" />
                            No
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}