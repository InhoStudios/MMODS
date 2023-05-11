import React from "react";

export default class ImageUploadFragment extends React.Component {
    render() {
        return (
            <div className="row {{ hideclass }} mb-3" id="imageuploads">
                <h4 className="mb-3">Image upload</h4>
                <div className="form-group mb-3 row">
                    <div className="col-lg-6">
                        <input type="file" className="form-control form-control-lg"
                               id="imgUpload" name="filename" accept="image/*" />
                    </div>
                    <div className="col-lg-6">
                        <input type="button" className="form-control form-control-lg"
                               id="sitetext" name="sitetext" value="Choose anatomic site ↓"
                               onClick="showBodyMap()" />
                        <input type="input" className="hidden-passthrough" id="anatomicsite"
                               name="anatomicsite" value="" />
                    </div>
                </div>
                <div className="form-group mb-3 row">
                    <div className="form-control-lg row">
                        <div className="col-lg-6">
                            <label>Image type</label>
                        </div>
                        <div className="col-lg-2">
                            <label htmlFor="clinical">
                                <input type="radio" className="form-check-input" id="clinical"
                                       name="imgtype" value="clinical" />
                                Clinical
                            </label>
                        </div>
                        <div className="col-lg-2">
                            <label htmlFor="dermoscopy">
                                <input type="radio" className="form-check-input" id="dermoscopy"
                                       name="imgtype" value="dermoscopy" />
                                Dermoscopy
                            </label>
                        </div>
                        <div className="col-lg-2">
                            <label htmlFor="other">
                                <input type="radio" className="form-check-input" id="other"
                                       name="imgtype" value="other" />
                                Other
                            </label>
                        </div>
                    </div>
                    <div className="form-control-lg row">
                        <div className="col-lg-6 offset-lg-6">
                            <input type="input"
                                   className="form-control form-control-lg hidden-passthrough"
                                   id="otherimg" name="otherimg" placeholder="other" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}