import React from "react";
import { ICD } from "../utilities/Structures";

export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiResponse: ""
        };
    }

    async fetchToken() {
        return await fetch("http://localhost:9000/token")
            .then((data) => data.json())
            .catch((err) => console.log(err));
    }

    componentDidMount() {
        let token;
        this.fetchToken().then((token) => {
            console.log(token);
            this.setState({apiResponse:token["access_token"]});
        });
    }

    render() {
        return (
            <>
                {this.state.apiResponse}
            </>
        )
    }
}