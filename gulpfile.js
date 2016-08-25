var del = require('del');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

var BUNDLE_NAME = 'sauron';
var BUILD_FOLDER = 'dist/';

gulp.task('clean', function() {
  return del(BUILD_FOLDER);
})

gulp.task('bundle', ['clean'], function() {
  return browserify({
      entries: './index.js',
      debug: true
    })
    .bundle()
    .pipe(source(BUNDLE_NAME + '.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('minify', ['bundle'], function() {
  return gulp.src(BUILD_FOLDER + BUNDLE_NAME + '.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('default', ['bundle', 'minify']);
