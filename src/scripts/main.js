import $ from "jquery";
import React from "react";
import Header from "./components/header";

let App = React.createClass({
    render: function () {
        return (
            <Header title={this.props.title}/>
        )
    }
});

$(() => {
    React.render(<App title="MyBooks"/>, $(".container")[0]);
});