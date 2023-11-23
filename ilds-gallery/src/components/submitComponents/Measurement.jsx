import React from "react";
import { ANATOMIC_SITES, SERVER_ENDPOINT } from "../../utilities/Structures";

export default class Measurement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anatomic: null,
            modality: null,
            lesion: null,
            show: true,
            image: '',
            image_file: '',
            visible: true, // is the entire field visible?

            searchTimeout: setTimeout(this.performSearch, 0),
            entities: [
            ],
            selectedOption: {
                "@id":"",
                "title":{
                    "@value":"",
                },
                "definition":  {
                    "@value": ""
                },
            },
            query: "",
        }
    }

    handleSiteSearchUpdate(e) {
        e.preventDefault();
        document.querySelectorAll(`.asites_${this.props.id}`).forEach(a => a.style.display = "block");
        let val = e.target.value;
        this.setState({anatomic:val});
        document.querySelectorAll(`.asite-element_${this.props.id}`).forEach(a => {
            let txt = a.textContent || a.innerText;
            if (txt.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
    }

    handleUpdateSite(site) {
        this.setState({anatomic: site.site});
        document.querySelectorAll(`.asites_${this.props.id}`).forEach(a => a.style.display = "none");
        this.props.updateSite(site.index);
    }

    handleImageTypeInput(e) {
        e.preventDefault();
        let val = e.target.value;
        this.setState({modality: val})
        document.querySelectorAll(`.std-type_${this.props.id}`).forEach(a => {
            let txt = a.textContent || a.innerText;
            if (txt.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
        this.props.updateImgtype(val);
    }

    handleUpdateImgType(val) {
        this.setState({modality: val});
        document.querySelectorAll(`.itype_${this.props.id}`).forEach(a => a.style.display = "none");
        this.props.updateImgtype(val);
    }

    // DIRECT INPUT HANDLERS

    handleUpdateImage(e) {
        console.log(`handleUpdateImage()`);
        let fileURL = URL.createObjectURL(e.target.files[0]);
        this.setState({ image: e.target.files[0], image_file: fileURL });
        console.log(e.target.files[0]);
    }

    // SEARCH HANDLERS
    handleQueryUpdate(e) {
        e.preventDefault();
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.performSearch(e.target.value, this), 300) });
    }

    async performSearch(input, caller) {
        let result = await fetch(`${SERVER_ENDPOINT}/search?query=${input}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        let sortedEntities = result.destinationEntities.sort(this.nestedSort("score"));
        let hierarchicalEntities = []
        for (let entity of sortedEntities) {
            hierarchicalEntities = hierarchicalEntities.concat(this.DFSEntities(entity, 0));
        }
        caller.setState({entities: hierarchicalEntities, query: input});
    }

    DFSEntities(entity, depth) {
        let entities = [];
        entity.title = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(depth) + entity.title;
        entities.push(entity);

        for (let descendant of entity.descendants) {
            entities = entities.concat(this.DFSEntities(descendant, depth + 1));
        }
        return entities;
    }

    nestedSort = (prop1) => (e1, e2) => {
        return (e1[prop1] < e2[prop1]) ? 1 : (e1[prop1] > e2[prop1]) ? -1 : 0;
    }

    async handleSelectChange(entry, caller) {
        document.querySelectorAll(`.diagnosis-list-${this.props.id}`).forEach(a => a.style.display = "none");
        let id = entry.id.replace("http://id.who.int/icd/entity/","");
        let entity = await fetch(`${SERVER_ENDPOINT}/entity?entity_code=${id}&include=ancestor`)
            .then((data) => data.json())
            .catch((err) => console.log("handleSelectChange()", err));
        // TODO: Get ancestor IDs and append to case_categories
        console.log(entity);
        // let curCase = caller.state.case;
        // let updateCase = {
        //     ...curCase
        // };
        // updateCase.title = entity.title["@value"].replace("<em class='found'>","").replace("</em>","");
        // updateCase.userEntity = id;
        // updateCase.ancestors = entity.ancestor;
        // console.log(entity.ancestor);
        // caller.setState({selectedOption: entity, case: updateCase});
        caller.setState({selectedOption: entity});

        let definitionField = document.getElementById(`entityDefinition${this.props.id}`);
        definitionField.style.display = "block";
    }
    // UTILITIES

    toggle(e) {
        e.preventDefault()
        this.setState({show: !this.state.show})
    }

    render() {
        return this.state.visible ? (
            <div className="row" id={"measurement" + this.props.id}>
                <div className="col-lg-1 mb-3">
                    <input type="submit" 
                        className={`form-control form-control-lg ${this.state.show ? 'btn-primary': 'btn-secondary'}`} 
                        value={this.state.show ? "▲" : "▼"}
                        onClick={this.toggle.bind(this)}/>
                </div>
                <div className="col-lg-10 mb-3">
                <input type="file" className="form-control form-control-lg"
                    id={`imgUpload_${this.props.id}`} name="filename" accept="image/*" 
                    onChange={(e) => {
                            this.handleUpdateImage(e)
                        }
                    }/>
                </div>
                <div className="col-lg-1 mb-3">
                    <input type="submit" 
                        className="form-control form-control-lg btn btn-danger btn-lg" 
                        value="✕"
                        onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                                visible: false,
                            });
                        }}
                        id={this.props.id}
                        />
                </div>
                <div className={`${this.state.show ? "" : "hidden-passthrough"}`}>
                    <div class="row">
                        <div className="col-lg-6 mb-3">
                            <div class="row">
                                <div className="mb-3 dropdown">
                                    <input type="input" className="form-control form-control-lg" 
                                        id="imgtype" placeholder="Imaging Modality ↓"
                                        value={this.state.modality}
                                        onChange={this.handleImageTypeInput.bind(this)}
                                        onFocus={(e) => {
                                            e.preventDefault();
                                            document.querySelectorAll(`.imodality_${this.props.id}`).forEach(a => a.style.display = "block");
                                        }}
                                        onBlur={(e) => {
                                            e.preventDefault();
                                            document.querySelectorAll(`.imodality_${this.props.id}`).forEach(a => a.style.display = "none");
                                        }}
                                    />
                                    {/* TODO: Update handleUpdateImageType() to account for multiple images */}
                                    <div className={`search-content imodality_${this.props.id}`}>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("PTG");
                                        }}>
                                                Clinical Photography (PTG)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("MDM");
                                        }}>
                                                Multispectral Dermoscopy (MDM)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("CLR");
                                        }}>
                                                Colorimetry (CLR)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("DRS");
                                        }}>
                                                Diffuse Reflectance Spectroscopy (DRS)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("SPK");
                                        }}>
                                                Polarization Speckle (SPK)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("POL");
                                        }}>
                                                Stokes Polarimetry (POL)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("MMS");
                                        }}>
                                                Multimodal Microscopy (MMS)
                                        </a>
                                        <a className={`itype_${this.props.id} std-type_${this.props.id}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            this.handleUpdateImgType("RAM");
                                        }}>
                                                Raman Spectroscopy (RAM)
                                        </a>
                                        <a className={`itype_${this.props.id}`}>Other</a>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <img className="img-fluid" src={this.state.image_file}/>
                            </div>
                            
                        </div>
                        <div className="col-lg-6 mb-3">
                            <form method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                                <div className="row mb-3">
                                    <div className="dropdown col-lg-8">
                                        <input type="input" className="form-control form-control-lg" 
                                            id="imgtype" placeholder="Lesion ↓"
                                            value={this.state.lesion}
                                            onChange={this.handleImageTypeInput.bind(this)}
                                            onFocus={(e) => {
                                                e.preventDefault();
                                                document.querySelectorAll(`.lesions-${this.props.id}`).forEach(a => a.style.display = "block");
                                            }}
                                            onBlur={(e) => {
                                                e.preventDefault();
                                                document.querySelectorAll(`.lesions-${this.props.id}`).forEach(a => a.style.display = "none");
                                            }}
                                        />
                                        <div className={`search-content lesions-${this.props.id}`}>
                                            <a className="les"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                // this.handleUpdateImgType("Clinical");
                                            }}>
                                                    230928A4a92
                                            </a>
                                            <a className="les"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                // this.handleUpdateImgType("Dermoscopy");
                                            }}>
                                                    230928A2H57
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <input type="submit" className="form-control form-control-lg btn btn-outline-primary btn-lg" value="New Lesion"/>
                                    </div>
                                </div>
                            </form>
                            <div className="form-group row">
                                <div className="mb-3 dropdown">
                                        <input type="input" className="form-control form-control-lg" id="search"
                                            name="search" placeholder="Search Diagnosis ↓"
                                                // value={this.state.query}
                                                onChange={this.handleQueryUpdate.bind(this)}
                                                onFocus={(e) => {
                                                    e.preventDefault();
                                                    document.querySelectorAll(`.diagnosis-list-${this.props.id}`).forEach(a => a.style.display = "block");
                                                }}/>
                                        <div className={`search-content diagnosis-list-${this.props.id}`}>
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
                                </div>
                            </div>
                            <div className="row">
                                <div class="hidden-passthrough" id={`entityDefinition${this.props.id}`}>
                                    <h5>{this.state.selectedOption.title["@value"]}</h5>
                                    <h6>{this.state.selectedOption["@id"]}</h6>
                                    <p>{
                                        this.state.selectedOption?.definition ? this.state.selectedOption.definition["@value"] : ""
                                    }</p>
                                </div>
                            </div>
                            <div className="row">
                                <img className="img-fluid" src={`${process.env.PUBLIC_URL}/amap.png`}/>
                            </div>
                            <div className="row">
                                
                                {/* <div className="col-lg-6 mb-3 dropdown">
                                    <input type="input" className="form-control form-control-lg" 
                                        id="sitetext" placeholder="Choose Anatomic Site ↓"
                                        value={this.state.anatomic}
                                        onChange={this.handleSiteSearchUpdate.bind(this)}
                                        onFocus={(e) => {
                                            e.preventDefault();
                                            document.querySelectorAll(".asites").forEach(a => a.style.display = "block");
                                        }}
                                        onBlur={(e) => {
                                            e.preventDefault();
                                            document.querySelectorAll(".asites").forEach(a => a.style.display = "none");
                                        }}
                                    />
                                    <div className="search-content asites">
                                        {
                                            ANATOMIC_SITES.map((site) => (
                                                <a 
                                                    className="asite-element" 
                                                    id={`ICDST${site.index}`} 
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        this.handleUpdateSite(site);
                                                    }}>
                                                    {site.site}
                                                </a>
                                            ))
                                        }
                                    </div>
                                    COMMENTED OUT <input type="button" className="form-control form-control-lg"
                                        id="sitetext" name="sitetext" value="Choose anatomic site ↓"
                                        onClick="showBodyMap()" />
                                    <input type="input" className="hidden-passthrough" id="anatomicsite"
                                        name="anatomicsite" value="" /> COMMENTED OUT
                                </div> */}
                            </div>
                            <div className="row">
                                <div className="col-lg-6 dropdown">
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
                                </div>
                                <div className="col-lg-6 dropdown">
                                    <div className="mb-3 row">
                                        <div className="form-group">
                                            <input type="number" className="form-control form-control-lg" id="size"
                                                    name="size" placeholder="Lesion size (mm)" min="0"
                                                    onChange={this.props.updateSize}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <textarea className="form-control form-control-lg" placeholder="Morphology"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <></>
        )
    }
}