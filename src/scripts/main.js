import $ from "jquery";
import React from "react";
import Login from "./components/Login";
import Books from "./components/Books";

window.renderComponent = function (comp) {
    React.render(comp, $(".container")[0]);
};

window.$ = $;
window.React = React;
window.Login = Login;
window.Books = Books;