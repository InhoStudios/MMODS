import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";

export default class ImageUploadField extends React.Component {

    render() {
        return (
            <div>
                <h4 className="mb-1">Image upload</h4>
                <ImageUploadFragment 
                    updateSite={this.props.updateSite} 
                    updateImage={this.props.updateImage}
                    updateImgtype={this.props.updateImgtype}
                    imageFile={this.props.imageFile}
                />
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