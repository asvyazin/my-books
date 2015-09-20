{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE QuasiQuotes           #-}
{-# LANGUAGE TemplateHaskell       #-}
{-# LANGUAGE TypeFamilies          #-}
{-# LANGUAGE CPP #-}

import Data.Text
import Web.Cookie
import Yesod
import Yesod.EmbeddedStatic

mkEmbeddedStatic True "eStatic"
  [ embedDirAt "bootstrap" "../bower_components/bootstrap/dist"
  , embedDirAt "jquery" "../bower_components/jquery/dist"
  , embedFileAt "js/jengine/cookie.js" "../bower_components/jengine-cookie/cookie.js"
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
    PageContent title headTags bodyTags <- widgetToPageContent contents
    withUrlRenderer $ do
      [hamlet|
        $doctype 5
        <html lang=en>
            <head>
                <meta charset=UTF-8>
                <title>#{title} - My Books
                <link rel=stylesheet href=@{StaticR bootstrap_css_bootstrap_css}>
                ^{headTags}
            <body>
                <!--[if lt IE 10]>
                <p .browserupgrade>You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
                <![endif]-->
                ^{bodyTags}
      |]

getHomeR :: Handler Html
getHomeR = defaultLayout [whamlet|
    <div .container>
    <script src=@{StaticR js_bundle_js}>
|]

getRedirectR :: Handler Html
getRedirectR = defaultLayout $ do
  [whamlet|
    <script src=@{StaticR jquery_jquery_js}>
    <script src=@{StaticR js_jengine_cookie_js}>|]
  toWidgetBody [julius|
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
        $cookie.set("onedrive-access-token", query.access_token);
        window.location = "@{HomeR}#/books";
    });
  |]

main :: IO ()
main = warp 8000 $ MyBooks eStatic
