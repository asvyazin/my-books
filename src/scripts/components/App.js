import React from "react";
import Header from "./Header";

let App = React.createClass({
    render () {
        const appTitle = "MyBooks";

        return (
            <div>
                <Header title={appTitle} accessToken={this.props.accessToken}/>
                {this.props.children}
            </div>
        );
    }
});

export default App;