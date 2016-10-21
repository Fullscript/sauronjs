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
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('clean', function() {
  return del(['dist/', 'es5/']);
});

function transpile(src, dest) {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('babel:src', ['clean'], function() {
  return transpile('src/**/*.js', 'es5/src/');
});

gulp.task('babel:spec', ['babel:src'], function() {
  return transpile('spec/**/*.spec.js', 'es5/spec/');
});

gulp.task('bundle', ['babel:src'], function() {
  return gulp.src('es5/src/index.js')
    .pipe(webpack({
      output: {
        filename: 'sauron.js',
        library: 'sauron',
        libraryTarget: 'umd'
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify', ['bundle'], function() {
  return gulp.src('dist/sauron.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/'));
});

gulp.task('demo', ['bundle'], function() {
  return connect.server({
    root: ['example/', 'dist/'],
    port: 3001
  });
});

// TODO: configure linting for es6
gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(eslint('.eslintrc.json'))
    .pipe(eslint.failOnError());
});

gulp.task('test', [ /*'lint', */ 'babel:spec'], function() {
  return gulp.src('es5/spec/**/*.spec.js')
    .pipe(webpack({
      resolve: {
        modulesDirectories: ['node_modules/', 'es5/']
      }
    }))
    .pipe(jasmineBrowser.specRunner({
      console: true
    }))
    .pipe(jasmineBrowser.headless());
});

gulp.task('release', ['minify']);
