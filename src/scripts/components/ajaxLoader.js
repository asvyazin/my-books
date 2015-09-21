import React from "react";

let AjaxLoader = React.createClass({
    render() {
        return <img className="center-block text-center" src="/static/res/images/ajax-loader.gif"/>;
    }
});

export default AjaxLoader;