import React from "react";
import Header from "./Header";

let App = React.createClass({
    render () {
        const appTitle = "MyBooks";

        return (
            <div>
                <Header title={appTitle}/>
                {this.props.children}
            </div>
        );
    }
});

export default App;