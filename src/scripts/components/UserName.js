import $ from "jquery";
import React from "react";
import AjaxLoader from "./AjaxLoader";

let UserName = React.createClass({
    getInitialState() {
        return {};
    },

    async componentDidMount() {
        try {
            let user = await $.ajax({
                url: "https://apis.live.net/v5.0/me",
                data: {
                    access_token: this.props.accessToken
                }
            });

            if (this.isMounted()) {
                this.setState({
                    ready: true,
                    name: user.name
                });
            }
        } catch (e) {
            this.setState({
                error: e.responseJSON.error.message
            });
        }
    },

    render() {
        if (this.state.ready) {
            return <span>{this.state.name}</span>;
        } else if (this.state.error) {
            return <span className="text-danger">{this.state.error}</span>;
        } else {
            return <AjaxLoader/>;
        }
    }
});

export default UserName;