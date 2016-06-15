'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

// As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.
gulp.task('concatScripts', function () {
  gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
  .pipe(concat('all.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('scripts', ['concatScripts'], function () {
  gulp.src('js/all.js')
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('default', function () {
  console.log('This is the default task');
});
