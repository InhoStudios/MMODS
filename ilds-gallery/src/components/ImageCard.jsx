import React from "react";

export default class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div className={this.props.colsize + " mb-3 mt-2"}>
                <button className="btn">
                    <div className="card card-shadow" onClick={null}>
                        <img src={this.props.filepath} className="img-fluid crop-img" alt={this.props.title}/>
                            <div className="card-body">
                                <span>http://id.who.int/icd/entity/{this.props.uri}</span>
                                <h4>{this.props.title}</h4>
                                <p></p>
                            </div>
                    </div>
                    <div className="mt-2">
                        <input type="checkbox" className="form-check-input" name="imgselect"
                               value="{{ entry.file }}-select" />
                    </div>
                </button>
            </div>
        )
    }
}