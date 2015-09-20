import React from "react";

let AjaxLoader = React.createClass({
    render() {
        return (
            <div className="center-block">
                <img className="center-block" src="/images/ajax-loader.gif"/>
            </div>
        );
    }
});

export default AjaxLoader;