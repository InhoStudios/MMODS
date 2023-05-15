import React from "react";
import ImageUploadField from "../components/submitComponents/ImageUploadField";
import PatientInfoField from "../components/submitComponents/PatientInfoField";
import DiagnosisField from "../components/submitComponents/DiagnosisField";
import Select from "react-select";

export default class Submit extends React.Component {
    searchQuery = "test";
    constructor(props) {
        super(props);
        // this.timeoutFunc = setTimeout(this.performSearch, 0);
        this.state = {
            hideclass: "hidden-passthrough",
            searchTimeout: setTimeout(this.performSearch, 0),
            query: "",
            entities: [
                {
                    title:"Search Diagnosis",
                    id:"http://id.who.int/icd/entity/null",
                    definition: "",
                }
            ],
            selectedOption: {
                definition:  "",
            },
        }
    }

    handleQueryUpdate(event) {
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.performSearch(event.target.value, this), 1000) });
    }
    
    async performSearch(input, caller) {
        let result = await fetch(`http://localhost:9000/search?query=${input}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        caller.setState({entities: result.destinationEntities, query: input});
    }

    handleSelectChange(option) {
        this.setState({ selectedOption: option })
    }

    testFunc(entry) {
        console.log(entry);
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
                                        <div className="form-group mb-3 dropdown">
                                            {/* <Select options={{"":"Search Diagnosis"}} value={null} onChange={this.handleSelectChange} className="form-control form-control-lg" id="search" name="search"/> */}
                                            <input type="input" className="form-control form-control-lg" id="search"
                                                name="search" placeholder="Search Diagnosis" value={this.props.query}
                                                    onChange={this.handleQueryUpdate.bind(this)}/>
                                            <div className="dropdown-content">
                                                {
                                                    this.state.entities.map((entry) => (
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            this.testFunc(entry);
                                                        }}
                                                        id={
                                                            entry.id.replace("https://id.who.int/icd/entity/")
                                                        }>{entry.title.replace("<em class='found'>", "").replace("</em>", "")}</a>
                                                    ))
                                                }
                                            </div>
                                            {/* <input type="submit" className="hidden-passthrough" name="submit"
                                                   value="Search" /> */}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p>{this.state.selectedOption.description}</p>
                                    </div>
                                    <div className={`row ${this.hideclass} mb-5`}>
                                        <DiagnosisField query={this.state.query} entities={this.state.entities} />
                                        <PatientInfoField />
                                        <ImageUploadField />
                                    </div>
                                    <div className="row mb-5">
                                        <div className="form-group mb-3">
                                            <input type="submit"
                                                   className={`form-control form-control-lg btn btn-outline-primary btn-lg ${this.hideclass}`}
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