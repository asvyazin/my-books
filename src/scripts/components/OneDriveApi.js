import _ from "underscore";
import $ from "jquery";

let OneDriveApi = {
    callOneDrive(accessToken, url, params) {
        const baseurl = "https://api.onedrive.com/v1.0";
        return $.ajax({
            url: baseurl + url,
            data: _.extend({access_token: accessToken}, params)
        });
    },

    getFolder(accessToken, path) {
        return this.callOneDrive(accessToken, "/drive/root:" + path);
    },

    getChildren(accessToken, path) {
        return this.callOneDrive(accessToken, "/drive/root:" + path + ":/children");
    }
};

export default OneDriveApi;