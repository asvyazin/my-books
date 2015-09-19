import React from "react";

let Header = React.createClass({
    render: function () {
        return (
            <div className="header">
                <h3 className="text-muted">{this.props.title}</h3>
            </div>
        );
    }
});

export default Header;