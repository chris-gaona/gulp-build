'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-clean-css');

// As a developer, when I run the gulp scripts or gulp styles commands at the command line, source maps are generated for the JavaScript and CSS files respectively.

// As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.
gulp.task('scripts', function () {
  gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('dist/scripts'));
});

// As a developer, I should be able to run the gulp styles command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder.
gulp.task('compileSass', function () {
  gulp.src('sass/global.scss')
  .pipe(sass())
  .pipe(rename('all.css'))
  .pipe(gulp.dest('css'));
});

gulp.task('styles', ['compileSass'], function () {
  gulp.src('css/all.css')
  .pipe(cssmin())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest('dist/styles'));
});

gulp.task('default', function () {
  console.log('This is the default task');
});
