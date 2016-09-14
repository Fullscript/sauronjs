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

var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var jasmineBrowser = require('gulp-jasmine-browser');
var eslint = require('gulp-eslint');
var webpack = require('webpack-stream');

var BUNDLE_NAME = 'sauron';
var globs = {
  src: 'src/**/*.js',
  spec: 'spec/**/*.spec.js'
};

var paths = {
  root: __dirname,
  entry: 'src/index.js',
  eslint: './.eslintrc.json',
  build: 'dist/',
  example: 'example/'
};

gulp.task('clean', function() {
  return del(paths.build);
});

gulp.task('bundle', ['clean'], function() {
  return gulp.src(paths.entry)
    .pipe(webpack({
      output: {
        filename: BUNDLE_NAME + '.js',
        library: BUNDLE_NAME,
        libraryTarget: 'umd'
      }
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify', ['bundle'], function() {
  return gulp.src(paths.build + BUNDLE_NAME + '.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(paths.build));
});

gulp.task('demo', ['bundle'], function() {
  return connect.server({
    root: [paths.example, paths.build],
    port: 3001
  });
});

gulp.task('lint', function() {
  return gulp.src(globs.src)
    .pipe(eslint(paths.eslint))
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function() {
  return gulp.src(globs.spec)
    .pipe(webpack({
      resolve: {
        root: paths.root
      }
    }))
    .pipe(jasmineBrowser.specRunner({
      console: true
    }))
    .pipe(jasmineBrowser.headless());
});

gulp.task('release', ['minify']);
