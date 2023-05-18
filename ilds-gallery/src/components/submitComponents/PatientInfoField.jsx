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
                            <div className="form-control-lg form-control" onChange={this.props.updateSex}>
                                <label className="col-lg-6" htmlFor="male">
                                    <input type="radio" className="form-check-input" id="male"
                                        name="sex" value="m" />
                                    Male
                                </label>
                                <label className="col-lg-6" htmlFor="female">
                                    <input type="radio" className="form-check-input" id="female"
                                        name="sex" value="f" />
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </label>
                <label>
                    Does the patient have a family history of this condition?
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <div className="form-control-lg form-control" onChange={this.props.updateHist}>
                                <label className="col-lg-6" htmlFor="histtrue">
                                    <input type="radio" className="form-check-input" id="histtrue"
                                        name="history" value="Y" />
                                    Yes
                                </label>
                                <label className="col-lg-6" htmlFor="histfalse">
                                    <input type="radio" className="form-check-input" id="histfalse"
                                        name="history" value="N" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                </label>
            </>
        )
    }
}