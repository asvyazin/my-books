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
  [ embedDirAt "bootstrap" "../bower_components/bootstrap/dist"
  , embedDirAt "jquery" "../bower_components/jquery/dist"
  , embedFileAt "js/jengine/cookie.js" "../bower_components/jengine-cookie/cookie.js"
  , embedDirAt "images" "../images"
  , embedFileAt "js/bundle.js" "../dist/bundle.js" ]

data MyBooks = MyBooks { getStatic :: EmbeddedStatic }

mkYesod "MyBooks" [parseRoutes|
/ HomeR GET
/Login LoginR GET
/Books/#Text BooksR GET
/redirect RedirectR GET
/static StaticR EmbeddedStatic getStatic
|]

instance Yesod MyBooks where
  addStaticContent = embedStaticContent getStatic StaticR Right
  defaultLayout contents = do
    PageContent title headTags bodyTags <- widgetToPageContent $ do
      addScript $ StaticR js_bundle_js
      addStylesheet $ StaticR bootstrap_css_bootstrap_css
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
                <div .container>
                ^{bodyTags}
      |]

getHomeR :: Handler ()
getHomeR = do
  onedriveAccessToken <- lookupCookie "onedrive-access-token"
  maybe (redirect LoginR) (\_ -> redirect (BooksR "/")) onedriveAccessToken

getLoginR :: Handler Html
getLoginR = defaultLayout $ do
  addScript $ StaticR jquery_jquery_js
  toWidget [julius|
    $(function () {
         renderComponent(React.createElement(Login, null));
    });
|]

getBooksR :: Text -> Handler Html
getBooksR encodedPath = defaultLayout $ do
  addScript $ StaticR jquery_jquery_js
  toWidget [julius|
    $(function () {
         renderComponent(React.createElement(Books, {encodedPath: "#{rawJS encodedPath}"}));
    });
|]

getRedirectR :: Handler Html
getRedirectR = defaultLayout $ do
  addScript (StaticR jquery_jquery_js)
  addScript (StaticR js_jengine_cookie_js)
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
        $cookie.set("onedrive-access-token", query.access_token);
        window.location = "@{HomeR}";
    });
  |]

main :: IO ()
main = warp 8000 $ MyBooks eStatic
