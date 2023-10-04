import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";
import Measurement from "./Measurement";

export default class ImageUploadField extends React.Component {

    render() {
        return (
            <div>
                <h4 className="mb-4">Measurements</h4>
                <Measurement 
                    updateSite={this.props.updateSite} 
                    updateImage={this.props.updateImage}
                    updateImgtype={this.props.updateImgtype}
                    updateQuery={this.props.updateQuery}
                    selectChange={this.props.selectChange}
                    parent={this.props.parent}
                    query={this.props.query}
                    updateSeverity={this.props.updateSeverity} 
                    updateDod={this.props.updateDod}
                    updateSize={this.props.updateSize}
                    imageFile={this.props.imageFile}
                />
                <div className="form-group mb-3">
                    <input type="button"
                           className="form-control form-control-lg btn btn-primary btn-lg {{ hideclass }}"
                           id="newimg" value="+   Add Measurement" name="newimg" data-id="0"
                           onClick="addImage()" />
                </div>
            </div>
        );
    }
}