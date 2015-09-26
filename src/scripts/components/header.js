import React from "react";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { Navigation } from "react-router";
import UserLink from "./UserLink";

let Header = React.createClass({
    mixins: [Navigation],

    render: function () {
        let user;
        if (this.props.accessToken) {
            user = <UserLink accessToken={this.props.accessToken} comp={NavItem}/>;
        }

        return <Navbar brand={this.props.title} fluid>
            <Nav navbar>
                <NavItem href={this.makeHref("login")}>Get new access token</NavItem>
            </Nav>
            <Nav navbar right>{user}</Nav>
        </Navbar>;
    }
});

export default Header;