'use strict';

//rquires all needed npm modules
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-clean-css'),
    maps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    connect = require('gulp-connect'),
    inject = require('gulp-inject');

// run the gulp lint command at the command line
gulp.task('lint', function () {
  // all of the project’s JavaScript files will be linted using ESLint
  // except for the node_modules folder
  // return keyword is useful for when using the task as a dependency in
  // another task
  return gulp.src(['js/**/*.js', '!node_modules/**'])
  // always require semicolons where applicable
  .pipe(eslint({
    'rules':{
      'semi': [1, 'always']
    }
  }))
  // and if there’s an error, the error will output to the console
  .pipe(eslint.format())
  // and the build process will be halted.
  .pipe(eslint.failOnError());
});

// run the gulp concatScripts command at the command line
// uses lint task as a dependency to be run first
gulp.task('concatScripts', ['lint'], function () {
  return gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
  // generates source maps
  .pipe(maps.init())
  // concatinates all js files
  .pipe(concat('all.js'))
  // writes source maps
  .pipe(maps.write('./'))
  // uses js folder as destination
  .pipe(gulp.dest('js'))
  // calls reload if user is running gulp serve for livereload
  .pipe(connect.reload());
});

// run the gulp scripts command at the command line
// uses concatScripts task as a dependency to be run first
gulp.task('scripts', ['concatScripts'], function () {
  return gulp.src('js/all.js')
  // minifies js file
  .pipe(uglify())
  // renames file to the following as minified file
  .pipe(rename('all.min.js'))
  // uses js folder as destination
  .pipe(gulp.dest('js'))
  // copies minified file to dist/scripts folder
  .pipe(gulp.dest('dist/scripts'));
});

// run the gulp compileSass command at the command line
gulp.task('compileSass', function () {
  return gulp.src('sass/global.scss')
  // generates source maps
  .pipe(maps.init())
  // compiles sass files to css
  .pipe(sass())
  // renames file to the following
  .pipe(rename('all.css'))
  // writes source maps
  .pipe(maps.write('./'))
  // uses css folder as destination
  .pipe(gulp.dest('css'))
  // calls reload if user is running gulp serve for livereload
  .pipe(connect.reload());
});

// run the gulp styles command at the command line
// uses compileSass task as a dependency to be run first
gulp.task('styles', ['compileSass'], function () {
  return gulp.src('css/all.css')
  // minifies css file
  .pipe(cssmin())
  // renames css file to the following
  .pipe(rename('all.min.css'))
  // uses css folder as the destination
  .pipe(gulp.dest('css'))
  // copies css file to dist/styles folder
  .pipe(gulp.dest('dist/styles'));
});

// run the gulp images command at the command line to
gulp.task('images', function () {
  return gulp.src('content/*')
  // optimizes the size of the project’s JPEG and PNG files
  .pipe(imagemin())
  // copies those optimized images to the dist/content folder
  .pipe(gulp.dest('dist/content'));
});

// gulp serve command builds and serves the project using a local web server.
gulp.task('connect', function() {
  // specifies port 3000 and makes livereload true
  connect.server({
    port: 3000,
    // root: 'dist',
    livereload: true
  });
});

// watch for changes to sass & js files & automatically compile/concat
gulp.task('watch', function () {
  gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['styles']);
  gulp.watch(['js/**/*.js'], ['scripts']);
});

// run the gulp clean command at the command line
// to delete all of the files and folders in the dist folder
gulp.task('clean', function() {
  //delete dist folder contents before rebuilding
  return del(['dist', 'css/all*.css*', 'js/all*.js*']);
});

// run the gulp build command at the command line
// uses clean task as a dependency so it is ran first
gulp.task('build', ['clean'], function () {
  // after clean task has ran....run scripts, styles, and images tasks
  gulp.start(['scripts', 'styles', 'images']);
  //{base:'./'} makes it so the build in dist uses
  //the proper directories from dev environment
  return gulp.src(['index.html', 'icons/**'], {base:'./'})
  // adds other needed files to dist folder
  .pipe(gulp.dest('dist'));
});

// run the gulp inject command at the command line
// used to add new script tags for production ready index.html
gulp.task('inject', function () {
  // define target
  var target = gulp.src('./dist/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  // define source files
  // injects new script tags into the index.html in the dist folder
  // sets relative option to true to remove the 'dist' part of the script tag
  return target.pipe(inject(gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./dist'));
});

// run the gulp command at the command line to run the “build” task.
gulp.task('default', ['build'], function () {
  // after build task is complete run the inject task
  gulp.start(['inject']);
});

// when running the gulp serve command, the scripts task is run
// and the current page is reloaded in the browser when a change
// is made to any JavaScript (*.js) file or sass files
gulp.task('serve', ['scripts', 'styles'], function () {
  gulp.start(['connect', 'watch']);
});
