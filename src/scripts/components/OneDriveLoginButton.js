import $ from "jquery";
import React from "react";
import { Button, Glyphicon } from "react-bootstrap";

let OneDriveLoginButton = React.createClass({
    render () {
        const params = $.param({
            client_id: this.props.clientId,
            scope: this.props.scope,
            redirect_uri: this.props.redirectURI,
            response_type: "token"
        });
        const loginURI = "https://login.live.com/oauth20_authorize.srf?" + params;

        return <Button href={loginURI} bsSize="large" className="col-md-offset-5 col-md-2">
            <Glyphicon glyph="cloud"/> Go to OneDrive
        </Button>;
    }
});

export default OneDriveLoginButton;