import React from "react";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import UserLink from "./UserLink";

let Header = React.createClass({
    render: function () {
        let user;
        if (this.props.accessToken) {
            user = <UserLink accessToken={this.props.accessToken} comp={NavItem}/>;
        }

        return <Navbar brand={this.props.title} fluid>
            <Nav navbar>
                <NavItem href="/Login">Get new access token</NavItem>
            </Nav>
            <Nav navbar right>{user}</Nav>
        </Navbar>;
    }
});

export default Header;