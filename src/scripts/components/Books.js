import $ from "jquery"
import "jquery.cookie"
import _ from "underscore"
import React from "react"
import { Panel, ListGroup, ListGroupItem, Glyphicon, Modal, Button } from "react-bootstrap"
import AjaxLoader from "./AjaxLoader"
import App from "./App"
import OneDriveApi from "./OneDriveApi"
import OneDriveDirectoryTree from "./OneDriveDirectoryTree.js"

let ChooseBooksDirectory = React.createClass({
    getInitialState() {
        return {
            showModal: false
        };
    },

    handleClick() {
        this.setState({
            showModal: true
        });
    },

    handleClose() {
        this.setState({
            showModal: false
        });
    },

    onChooseItem(path) {
        this.props.onChooseDirectory(path);
        this.setState({
            showModal: false
        });
    },

    render(){
        return <div>
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose directory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OneDriveDirectoryTree key="/" path="/" name="/" accessToken={this.props.accessToken}
                                           onChooseItem={this.onChooseItem}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <a href="javascript:;" onClick={this.handleClick}>Choose directory</a>
        </div>;
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

        return <ListGroupItem folder={folder} path={this.props.path}>
            {icon} {this.props.name} {badge}
        </ListGroupItem>;
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
    getInitialState() {
        return {
            booksPath: $.cookie("mybooks-books-path")
        };
    },

    onChooseDirectory(path) {
        $.cookie("mybooks-books-path", path);
        this.setState({
            booksPath: path
        });
    },

    render() {
        var accessToken = $.cookie("onedrive-access-token");

        if (this.state.booksPath) {
            return <Folder key={this.state.booksPath} path={this.state.booksPath} accessToken={accessToken}/>;
        } else {
            return <ChooseBooksDirectory accessToken={accessToken} onChooseDirectory={this.onChooseDirectory}/>;
        }
    }
});

export default Books;