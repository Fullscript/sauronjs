/*
  PLEASE NOTE

  TL;DR only use webpack for bundling if possible

  There is tooling overlap between webpack and gulp. Webpack is a frontend swiss army knife
  It offers tons of features/plugins from module bundling, minification, concatenation of various
  filetypes, a web development server with hot module replacement, transpilation options etc etc.

  With tooling, I find it best (only my opinion) to avoid vendor lock in and compose a custom pipeline
  built from various tools, and to swap them out when needed. Which is why I like gulp,
  since it only specifies a streamable interface with fs globbing and fs watching.
  Originally I let the great browserify attempt to bundle our project, Unfortunately it does
  not play nice with gulp due to it having its own stdout based stream interface. Webpack has
  an easy to use streamable wrapper, so it will be used as the bundler. However tasks such as
  minification, babelification, local http webserver, pipelining non-JS files and such will be
  composed of gulp tasks to minimize vendor lock in.
*/

import del from 'del';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import connect from 'gulp-connect'
import jasmineBrowser from 'gulp-jasmine-browser';
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
import path from 'path'

const BUNDLE_NAME = 'sauron';
const BUILD_DIR = 'dist/';

const moduleConfig = {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: { "presets": ["es2015"] }
    }
  ]
};

const webpackConfig = {
  module: moduleConfig,
  output: {
    filename: BUNDLE_NAME + '.js',
    library: BUNDLE_NAME,
    libraryTarget: 'umd'
  }
};

const webpackTestConfig = {
  module: moduleConfig,
  resolve: {
    root: path.resolve(__dirname)
  }
};


gulp.task('clean', function() {
  return del(BUILD_DIR);
});

gulp.task('bundle', ['clean'], function() {
  return gulp.src('src/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('minify', ['bundle'], function() {
  return gulp.src(BUILD_DIR + BUNDLE_NAME + '.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('demo', ['bundle'], function() {
  return connect.server({
    root: ['example', BUILD_DIR],
    port: 3001
  });
});

gulp.task('test', function() {
  return gulp.src('spec/**/*.spec.js')
    .pipe(webpack(webpackTestConfig))
    .pipe(jasmineBrowser.specRunner({
      console: true
    }))
    .pipe(jasmineBrowser.headless());
});

gulp.task('release', ['minify']);
