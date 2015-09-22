import $ from "jquery";
import "jquery.cookie";
import React from "react";
import { RouteHandler } from "react-router";
import Header from "./Header";

let App = React.createClass({
    getInitialState() {
        return {
            accessToken: $.cookie("onedrive-access-token")
        };
    },

    render () {
        const appTitle = "MyBooks";

        return <div>
            <Header title={appTitle} accessToken={this.state.accessToken}/>
            <RouteHandler/>
        </div>;
    }
});

export default App;