{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE QuasiQuotes           #-}
{-# LANGUAGE TemplateHaskell       #-}
{-# LANGUAGE TypeFamilies          #-}
{-# LANGUAGE ViewPatterns #-}
{-# LANGUAGE CPP #-}

import Data.Text
import Text.Julius
import Web.Cookie
import Yesod
import Yesod.EmbeddedStatic

#ifdef DEBUG
#define DEVELOPMENT True
#else
#define DEVELOPMENT False
#endif

mkEmbeddedStatic DEVELOPMENT "eStatic"
  [ embedDirAt "bootstrap" "../node_modules/bootstrap/dist"
  , embedDirAt "jquery" "../node_modules/jquery/dist"
  , embedFileAt "jquery.cookie/jquery.cookie.js" "../node_modules/jquery.cookie/jquery.cookie.js"
  , embedFileAt "css/react-treeview.css" "../node_modules/react-treeview/react-treeview.css"
  , embedDirAt "images" "../images"
  , embedFileAt "js/bundle.js" "../dist/bundle.js" ]

data MyBooks = MyBooks { getStatic :: EmbeddedStatic }

mkYesod "MyBooks" [parseRoutes|
/ HomeR GET
/redirect RedirectR GET
/static StaticR EmbeddedStatic getStatic
|]

instance Yesod MyBooks where
  addStaticContent = embedStaticContent getStatic StaticR Right
  defaultLayout contents = do
    PageContent title headTags bodyTags <- widgetToPageContent $ do
      addStylesheet $ StaticR bootstrap_css_bootstrap_css
      addStylesheet $ StaticR css_react_treeview_css
      contents
    withUrlRenderer [hamlet|
        $doctype 5
        <html lang=en>
            <head>
                <meta charset=UTF-8>
                <title>#{title} - My Books
                ^{headTags}
            <body>
                <!--[if lt IE 10]>
                <p .browserupgrade>You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
                <![endif]-->
                ^{bodyTags}
      |]

getHomeR :: Handler Html
getHomeR = defaultLayout $ do
  addScript $ StaticR js_bundle_js
  [whamlet|
      <div .container>
          <div .application>
  |]

getRedirectR :: Handler Html
getRedirectR = defaultLayout $ do
  addScript (StaticR jquery_jquery_js)
  addScript (StaticR jquery_cookie_jquery_cookie_js)
  toWidget [julius|
    function parseQuery(str) {
        var result = {};
        var vars = str.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return result;
    }

    $(function () {
        var query = parseQuery(window.location.hash.substring(1));
        $.cookie("onedrive-access-token", query.access_token);
        window.location = "@{HomeR}";
    });
  |]

main :: IO ()
main = warp 8000 $ MyBooks eStatic
