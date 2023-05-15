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
            ],
            selectedOption: {
                "@id":"",
                "title":{
                    "@value":"",
                },
                "definition":  "",
            },
        }
    }

    handleQueryUpdate(event) {
        event.preventDefault();
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.performSearch(event.target.value, this), 500) });
    }
    
    async performSearch(input, caller) {
        let result = await fetch(`http://localhost:9000/search?query=${input}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        caller.setState({entities: result.destinationEntities, query: input});
    }

    async handleSelectChange(entry, caller) {
        document.querySelectorAll(".search-content").forEach(a => a.style.display = "none");
        let id = entry.id.replace("http://id.who.int/icd/entity/","");
        let entity = await fetch(`http://localhost:9000/entity?entity_code=${id}`)
            .then((data) => data.json())
            .catch((err) => console.log("handleSelectChange()", err));
        caller.setState({selectedOption: entity});
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

                                <form method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row mb-3">
                                        <h4 className="mb-3">Search ICD-11 (ICDD) diagnosis</h4>
                                        <div className="form-group mb-3 dropdown">
                                            {/* <Select options={{"":"Search Diagnosis"}} value={null} onChange={this.handleSelectChange} className="form-control form-control-lg" id="search" name="search"/> */}
                                            <input type="input" className="form-control form-control-lg" id="search"
                                                name="search" placeholder="Search Diagnosis" value={this.props.query}
                                                    onChange={this.handleQueryUpdate.bind(this)}
                                                    onFocus={(e) => {
                                                        e.preventDefault();
                                                        document.querySelectorAll(".search-content").forEach(a => a.style.display = "block");
                                                    }}/>
                                            <div className="search-content">
                                                {
                                                    this.state.entities.map((entry) => (
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleSelectChange(entry, this);
                                                        }}
                                                        id={
                                                            entry.id.replace("https://id.who.int/icd/entity/")
                                                        } dangerouslySetInnerHTML={{__html: entry.title}} />
                                                    ))
                                                }
                                            </div>
                                            {/* <input type="submit" className="hidden-passthrough" name="submit"
                                                   value="Search" /> */}
                                        </div>
                                        {/* <p>{this.state.selectedOption.definition["@value"]}</p> */}
                                    </div>
                                </form>
                                <form method="post" encType="multipart/form-data">
                                    <div className={`row ${this.hideclass} mb-5`}>
                                        <DiagnosisField entity={this.state.selectedOption} />
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