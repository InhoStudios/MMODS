import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";

export default class ImageUploadField extends React.Component {

    render() {
        return (
            <div>
                <ImageUploadFragment updateSite={this.props.updateSite} updateImage={this.props.updateImage}/>
                {/* <div className="form-group mb-3">
                    <input type="button"
                           className="form-control form-control-lg btn btn-primary btn-lg {{ hideclass }}"
                           id="newimg" value="+   Add image" name="newimg" data-id="0"
                           onClick="addImage()" />
                </div> */}
            </div>
        );
    }
}