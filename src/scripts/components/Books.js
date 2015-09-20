import $ from "jquery";
import $cookie from "jengine-cookie";
import _ from "underscore";
import React from "react";
import { Link } from "react-router";
import AjaxLoader from "./ajaxLoader";

function callOneDrive(accessToken, url, params) {
    const baseurl = "https://api.onedrive.com/v1.0";
    return $.ajax({
        url: baseurl + url,
        data: _.extend({access_token: accessToken}, params)
    });
}

let FolderChildPanel = React.createClass({
    render() {
        if (this.props.folder) {
            return (
                <Link className="list-group-item" to="books" activeClassName=""
                      params={{encodedPath: encodeURIComponent(this.props.path)}}>{this.props.children}</Link>
            );
        } else {
            return (
                <div className="list-group-item">{this.props.children}</div>
            );
        }
    }
});

let FolderChildItem = React.createClass({
    render() {
        var folder;
        var badge;
        if (this.props.childrenCount) {
            badge = <span className="badge">{this.props.childrenCount}</span>;
            folder = true;
        }

        return (
            <FolderChildPanel folder={folder} path={this.props.path}>
                {this.props.name}
                {badge}
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
            folderName = <h3 className="panel-title">{this.state.folder.name}</h3>;
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
            folderChildren =
                <div className="panel-body list-group">
                    {childrenNodes}
                </div>;
        }

        return (
            <div className="panel panel-default col-md-6">
                <div className="panel-heading">
                    {loadingIndicator} {folderName}
                </div>
                {folderChildren}
            </div>
        );
    }
});

let Books = React.createClass({
    render() {
        var accessToken = $cookie.get("onedrive-access-token");
        var path = "/";
        if (this.props.params.encodedPath) {
            path = decodeURIComponent(this.props.params.encodedPath);
        }

        return (
            <Folder path={path} accessToken={accessToken}/>
        );
    }
});

export default Books;