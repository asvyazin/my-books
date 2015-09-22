import gulp from "gulp";
import rimraf from "rimraf";
import webpack from "webpack";
import path from "path";
import BrowserSync from "browser-sync-webpack-plugin";

let config = {
    sourceDir: path.join(__dirname, "src"),
    outputDir: path.join(__dirname, "dist"),
    bundleFile: "bundle.js"
};

let webpackConfig = {
    cache: true,
    debug: true,

    entry: [path.join(config.sourceDir, "scripts", "main.js")],

    output: {
        path: config.outputDir,
        filename: config.bundleFile
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: "babel",
            query: {
                optional: ["runtime"]
            }
        }]
    },

    plugins: [new BrowserSync({
        proxy: "http://localhost:8000"
    })]
};

gulp.task("clean", cb => {
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
    if (!bundler) {
        bundler = webpack(webpackConfig);
    }
    return bundler;
}

function bundleCallback(err, stats) {
    if (err)
        throw err;

    console.log(stats.toString({
        colors: true,
        reasons: true,
        hash: false,
        version: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        cached: false,
        cachedAssets: false
    }));
}

gulp.task("build", ["clean"], () => {
    return getBundler().run(bundleCallback);
});

gulp.task('watch', ['build'], () => {
    return getBundler().watch(200, bundleCallback);
});
