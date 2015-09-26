import React from "react"
import TreeView from "react-treeview"
import _ from "underscore"
import AjaxLoader from "./AjaxLoader"
import OneDriveApi from "./OneDriveApi.js"

let OneDriveDirectoryTree = React.createClass({
    mixins: [OneDriveApi],

    getInitialState() {
        return {
            collapsed: true,
            loaded: false,
            children: []
        }
    },

    async handleClick() {
        if (!this.state.collapsed) {
            this.setState({
                collapsed: true,
                loaded: false,
                children: []
            })
        } else {
            this.setState({
                collapsed: false,
                loaded: false,
                children: []
            });

            let children = await this.getChildren(this.props.accessToken, this.props.path);

            this.setState({
                collapsed: false,
                loaded: true,
                children: _.chain(children.value)
                    .filter(child => !!child.folder)
                    .map(child => {
                        var path = this.props.path;
                        if (path.substring(path.size - 1) !== "/") {
                            path = path + "/";
                        }
                        path = path + child.name;

                        return {
                            name: child.name,
                            path: path
                        };
                    })
                    .value()
            });
        }
    },

    render() {
        let children;
        if (!this.state.collapsed) {
            if (!this.state.loaded) {
                children = <AjaxLoader/>;
            } else {
                children = _.map(this.state.children, child => <OneDriveDirectoryTree
                    key={child.path}
                    path={child.path}
                    name={child.name}
                    accessToken={this.props.accessToken}/>);
            }
        }

        return <TreeView
            nodeLabel={this.props.name}
            collapsed={this.state.collapsed}
            onClick={this.handleClick}>{children}</TreeView>;
    }
});

export default OneDriveDirectoryTree;