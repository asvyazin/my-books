import React from "react";
import { Navbar, NavItem, Nav } from "react-bootstrap";

let Header = React.createClass({
    render: function () {
        return <Navbar brand={this.props.title}>
            <Nav>
                <NavItem href="/Login">Get new access token</NavItem>
            </Nav>
        </Navbar>;
    }
});

export default Header;