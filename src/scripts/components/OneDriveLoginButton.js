import $ from "jquery";
import React from "react";

let OneDriveLoginButton = React.createClass({
    render () {
        const params = $.param({
            client_id: this.props.clientId,
            scope: this.props.scope,
            redirect_uri: this.props.redirectURI,
            response_type: "token"
        });
        const loginURI = "https://login.live.com/oauth20_authorize.srf?" + params;

        return (
            <a className="btn btn-default btn-lg col-md-offset-5 col-md-2" role="button" href={loginURI}>
                <span className="glyphicon glyphicon-cloud"></span>
                Login to OneDrive
            </a>
        );
    }
});

export default OneDriveLoginButton;