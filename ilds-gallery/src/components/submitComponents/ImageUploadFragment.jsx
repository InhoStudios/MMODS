import React from "react";
import { ANATOMIC_SITES } from "../../utilities/Structures";

export default class ImageUploadFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anatomic: null
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

    render() {
        return (
            <>
                <h4 className="mb-3">Image upload</h4>
                <div className="form-group mb-3 row">
                    <div className="col-lg-6">
                        <input type="file" className="form-control form-control-lg"
                               id="imgUpload" name="filename" accept="image/*" />
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
                <label>
                    Image type
                    <div className="form-group mb-3 row">
                        <div className="form-control-lg">
                            <div className="form-control-lg form-control" onChange={this.props.updateSeverity}>
                                <label className="col-lg-4" htmlFor="clinical">
                                    <input type="radio" className="form-check-input" id="clinical"
                                        name="imgtype" value="clinical" />
                                    Benign
                                </label>
                                <label className="col-lg-4" htmlFor="dermoscopy">
                                    <input type="radio" className="form-check-input" id="dermoscopy"
                                        name="imgtype" value="dermoscopy" />
                                    Dermoscopy
                                </label>
                                <label className="col-lg-4" htmlFor="other">
                                    <input type="radio" className="form-check-input" id="other"
                                        name="imgtype" value="other" />
                                    Other
                                </label>
                            </div>
                        </div>
                        <div className="form-control-lg row">
                            <div className="col-lg-12">
                                <input type="input"
                                    className="form-control form-control-lg hidden-passthrough"
                                    id="otherimg" name="otherimg" placeholder="other" />
                            </div>
                        </div>
                    </div>
                </label>
            </>
        )
    }
}