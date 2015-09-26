import $ from "jquery"
import "jquery.cookie"
import _ from "underscore"
import React from "react"
import { Panel, ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap"
import { Navigation } from "react-router"
import AjaxLoader from "./AjaxLoader"
import App from "./App"
import OneDriveApi from "./OneDriveApi"

let FolderChildPanel = React.createClass({
    mixins: [Navigation],

    render() {
        let url;
        if (this.props.folder) {
            url = this.makeHref("books", {encodedPath: encodeURIComponent(this.props.path)});
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

        return <FolderChildPanel folder={folder} path={this.props.path}>
            {icon} {this.props.name} {badge}
        </FolderChildPanel>;
    }
});

let Folder = React.createClass({
    mixins: [OneDriveApi],

    getInitialState() {
        return {};
    },

    async componentDidMount() {
        let folder = await this.getFolder(this.props.accessToken, this.props.path);
        let children = await this.getChildren(this.props.accessToken, this.props.path);

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

        const header = <h3 className="text-center">{loadingIndicator} {folderName}</h3>;
        return <Panel header={header}>{folderChildren}</Panel>;
    }
});

let Books = React.createClass({
    render() {
        var accessToken = $.cookie("onedrive-access-token");
        var path = "/";
        if (this.props.params.encodedPath) {
            path = decodeURIComponent(this.props.params.encodedPath);
        }

        return <Folder key={path} path={path} accessToken={accessToken}/>;
    }
});

export default Books;