import $ from "jquery";
import React from "react";
import AjaxLoader from "./AjaxLoader";

let UserLink = React.createClass({
    getInitialState() {
        return {};
    },

    async componentDidMount(){
        let user = await $.ajax({
            url: "https://apis.live.net/v5.0/me",
            data: {
                access_token: this.props.accessToken
            }
        });

        if (this.isMounted()) {
            this.setState({
                ready: true,
                name: user.name,
                href: "javascript:;"
            });
        }
    },

    render() {
        if (this.state.ready) {
            let comp = this.props.comp;
            return React.createElement(this.props.comp, {
                href: this.state.href
            }, this.state.name);
        }

        return <AjaxLoader/>;
    }
});

export default UserLink;