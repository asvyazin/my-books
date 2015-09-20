import $ from "jquery";
import $cookie from "jengine-cookie";
import _ from "underscore";
import React from "react";
import AjaxLoader from "./ajaxLoader";
import App from "./App";
import { Panel, ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap";

function callOneDrive(accessToken, url, params) {
    const baseurl = "https://api.onedrive.com/v1.0";
    return $.ajax({
        url: baseurl + url,
        data: _.extend({access_token: accessToken}, params)
    });
}

let FolderChildPanel = React.createClass({
    render() {
        let url;
        if (this.props.folder) {
            url = "/Books/" + encodeURIComponent(this.props.path);
        }

        return <ListGroupItem href={url}>{this.props.children}</ListGroupItem>;
    }
});

let FolderChildItem = React.createClass({
    render() {
        var folder;
        var badge;
        var icon;
        if (this.props.childrenCount) {
            badge = <span className="badge">{this.props.childrenCount}</span>;
            folder = true;
            icon = <Glyphicon glyph="folder-close"/>;
        } else {
            icon = <Glyphicon glyph="file"/>;
        }

        return (
            <FolderChildPanel folder={folder} path={this.props.path}>
                {icon} {this.props.name} {badge}
            </FolderChildPanel>
        );
    }
});

let Folder = React.createClass({
    getInitialState() {
        return {};
    },

    async componentDidMount() {
        let folder = await callOneDrive(this.props.accessToken, "/drive/root:" + this.props.path);
        let children = await callOneDrive(this.props.accessToken, "/drive/root:" + this.props.path + ":/children");

        if (this.isMounted()) {
            this.setState({
                folder: folder,
                children: children,
                loaded: true
            });
        }
    },

    render() {
        var folderName;
        var folderChildren;
        var loadingIndicator;
        if (!this.state.loaded) {
            loadingIndicator = <AjaxLoader/>;
        } else {
            console.log("render");
            folderName = <span><Glyphicon glyph="folder-open"/> {this.state.folder.name}</span>;
            var childrenNodes = this.state.children.value.map(x => {
                var childrenCount;
                if (x.folder && x.folder.childCount) {
                    childrenCount = x.folder.childCount;
                }

                var path = this.props.path;
                if (path.substring(path.size - 1) !== "/") {
                    path = path + "/";
                }
                path = path + x.name;
                return <FolderChildItem key={x.id} name={x.name} path={path} childrenCount={childrenCount}/>;
            });
            folderChildren = <ListGroup fill>{childrenNodes}</ListGroup>;
        }

        const header = <h3>{loadingIndicator} {folderName}</h3>;
        return <Panel header={header}>{folderChildren}</Panel>;
    }
});

let Books = React.createClass({
    render() {
        var accessToken = $cookie.get("onedrive-access-token");
        var path = "/";
        if (this.props.encodedPath) {
            path = decodeURIComponent(this.props.encodedPath);
        }

        return <App><Folder path={path} accessToken={accessToken}/></App>;
    }
});

export default Books;