import $ from "jquery";
import React from "react";
import App from "./components/App";
import Login from "./components/Login";
import Books from "./components/Books";
import Router, { Route, DefaultRoute, HashLocation } from "react-router";

const routes = <Route path="/" handler={App}>
    <DefaultRoute handler={Books}/>
    <Route name="login" path="login" handler={Login}/>
    <Route name="books" path="books/:encodedPath" handler={Books}/>
</Route>;

Router.run(routes, HashLocation, (Handler) => {
    React.render(<Handler/>, $(".application")[0]);
});