import React from "react";
import OneDriveLoginButton from "./OneDriveLoginButton";

let Login = React.createClass({
    render () {
        const onedriveClientId = "000000004816D42C";
        const redirectURI = "http://localhost:3000/redirect";
        return <OneDriveLoginButton clientId={onedriveClientId} scope="wl.signin onedrive.readonly"
                                    redirectURI={redirectURI}/>;
    }
});

export default Login;