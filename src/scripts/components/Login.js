import React from "react";
import App from "./App";
import OneDriveLoginButton from "./OneDriveLoginButton";

let Login = React.createClass({
    render () {
        const onedriveClientId = "000000004816D42C";
        const redirectURI = "http://localhost:3000/redirect";
        return <App>
            <OneDriveLoginButton clientId={onedriveClientId}
                                 scope="wl.signin onedrive.readonly"
                                 redirectURI={redirectURI}/>
        </App>;
    }
});

export default Login;