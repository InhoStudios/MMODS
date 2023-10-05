import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";
import Measurement from "./Measurement";

export default class ImageUploadField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            measurements: [<Measurement id={0} removeField={this.removeField.bind(this)} {...this.props} />],
            idCounter: 1,
        };
    }

    addImage() {
        this.setState(prevState => ({
            measurements: [...prevState.measurements, <Measurement 
                                                        id={prevState.idCounter} 
                                                        removeField={this.removeField.bind(this)} 
                                                        {...this.props} />
                                                    ],
            idCounter: prevState.idCounter + 1,
        }));
    }

    removeField(e) {
        let updatedMeasurements = [...this.state.measurements];
        let index = updatedMeasurements.findIndex(item => item.props.id == e.target.id);
        if (index >= 0) {
            updatedMeasurements.splice(index, 1);
        }
        console.log(e.target.id);
        this.setState({
            measurements: updatedMeasurements
        });
    }

    render() {
        return (
            <div className="mb-4">
                <h4 className="mb-4">Add Measurements</h4>
                <div id="measurements-sect">
                    {this.state.measurements}
                </div>
                <div className="form-group mb-3">
                    <input type="button"
                           className="form-control form-control-lg btn btn-primary btn-lg {{ hideclass }}"
                           id="newimg" value="+   Add Measurement" name="newimg" data-id="0"
                           onClick={this.addImage.bind(this)} />
                </div>
            </div>
        );
    }
}