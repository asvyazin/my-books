import $ from "jquery";
import React from "react";
import Router, { Route, DefaultRoute, RouteHandler } from "react-router";
import Header from "./components/header";
import OneDriveLoginButton from "./components/OneDriveLoginButton";
import Books from "./components/Books";

const appTitle = "MyBooks";
const onedriveClientId = "000000004816D42C";

let Login = React.createClass({
    render () {
        const redirectURI = "http://localhost:3000/redirect";
        return (<OneDriveLoginButton clientId={onedriveClientId}
                                     scope="wl.signin onedrive.readonly"
                                     redirectURI={redirectURI}/>);
    }
});

let App = React.createClass({
    render () {
        return (
            <div>
                <Header title={appTitle}/>
                <RouteHandler/>
            </div>
        );
    }
});

$(() => {
    const routes = (
        <Route handler={App}>
            <Route path="books" handler={Books}/>
            <Route name="books" path="books/:encodedPath" handler={Books}/>
            <DefaultRoute handler={Login}/>
        </Route>
    );
    Router.run(routes, Router.HashLocation, function (Handler) {
        React.render(<Handler/>, $(".container")[0]);
    });
});