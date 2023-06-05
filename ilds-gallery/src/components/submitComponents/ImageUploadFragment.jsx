import React from "react";
import { ANATOMIC_SITES } from "../../utilities/Structures";

export default class ImageUploadFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anatomic: null,
            modality: null
        }
    }

    handleSiteSearchUpdate(e) {
        e.preventDefault();
        document.querySelectorAll(".asites").forEach(a => a.style.display = "block");
        let val = e.target.value;
        this.setState({anatomic:val});
        document.querySelectorAll(".asite-element").forEach(a => {
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
        document.querySelectorAll(".asites").forEach(a => a.style.display = "none");
        this.props.updateSite(site.index);
    }

    handleImageTypeInput(e) {
        e.preventDefault();
        let val = e.target.value;
        this.setState({modality: val})
        document.querySelectorAll(".std-type").forEach(a => {
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
        document.querySelectorAll(".itype").forEach(a => a.style.display = "none");
        this.props.updateImgtype(val);
    }

    render() {
        return (
            <>
                <div className="text-center mb-3">
                    <img src={this.props.imageFile}/>
                </div>
                <div className="row mb-3">
                    <div className="form-group">
                            <input type="file" className="form-control form-control-lg"
                                id="imgUpload" name="filename" accept="image/*" 
                                onChange={this.props.updateImage}/>
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="col-lg-6 dropdown">
                        <input type="input" className="form-control form-control-lg" 
                            id="imgtype" placeholder="Imaging Modality ↓"
                            value={this.state.modality}
                            onChange={this.handleImageTypeInput.bind(this)}
                            onFocus={(e) => {
                                e.preventDefault();
                                document.querySelectorAll(".imodality").forEach(a => a.style.display = "block");
                            }}
                            onBlur={(e) => {
                                e.preventDefault();
                                document.querySelectorAll(".imodality").forEach(a => a.style.display = "none");
                            }}
                        />
                        <div className="search-content imodality">
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("Clinical");
                            }}>
                                    Clinical
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("Dermoscopy");
                            }}>
                                    Dermoscopy
                            </a>
                            <a className="itype">Other</a>
                        </div>
                    </div>
                    <div className="col-lg-6 dropdown">
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
                        {/* <input type="button" className="form-control form-control-lg"
                               id="sitetext" name="sitetext" value="Choose anatomic site ↓"
                               onClick="showBodyMap()" />
                        <input type="input" className="hidden-passthrough" id="anatomicsite"
                               name="anatomicsite" value="" /> */}
                    </div>
                </div>
            </>
        )
    }
}