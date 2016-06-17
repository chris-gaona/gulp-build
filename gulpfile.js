'use strict';

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

// As a developer, when I run the gulp scripts command at the command line, all of my project’s JavaScript files will be linted using ESLint and if there’s an error, the error will output to the console and the build process will be halted.
gulp.task('lint', function () {
  return gulp.src(['js/**/*.js', '!node_modules/**'])
  .pipe(eslint({
    'rules':{
      'semi': [1, 'always']
    }
  }))
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

// As a developer, when I run the gulp scripts or gulp styles commands at the command line, source maps are generated for the JavaScript and CSS files respectively.

// As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.
gulp.task('concatScripts', ['lint'], function () {
  return gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
  .pipe(maps.init())
  .pipe(concat('all.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'))
  .pipe(connect.reload());
});

gulp.task('scripts', ['concatScripts'], function () {
  return gulp.src('js/all.js')
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('js'))
  .pipe(gulp.dest('dist/scripts'));
});

// As a developer, I should be able to run the gulp styles command at the command line to compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder.
gulp.task('compileSass', function () {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(rename('all.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'))
  .pipe(connect.reload());
});

gulp.task('styles', ['compileSass'], function () {
  return gulp.src('css/all.css')
  .pipe(cssmin())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest('css'))
  .pipe(gulp.dest('dist/styles'));
});

// As a developer, I should be able to run the gulp images command at the command line to optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.
gulp.task('images', function () {
  return gulp.src('content/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/content'));
});

// The gulp serve command builds and serves the project using a local web server.
gulp.task('connect', function() {
  connect.server({
    port: 3000,
    // root: 'dist',
    livereload: true
  });
});

// watch for changes to sass & js files & automatically compile/concat
gulp.task('watch', function () {
  gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['compileSass']);
  gulp.watch(['js/**/*.js'], ['concatScripts']);
});

// As a developer, I should be able to run the gulp clean command at the command line to delete all of the files and folders in the dist folder.
gulp.task('clean', function() {
  //delete dist folder contents before rebuilding
  del(['dist', 'css/all*.css*', 'js/all*.js*']);
});

// As a developer, I should be able to run the gulp build command at the command line to run the clean, scripts, styles, and images tasks with confidence that the clean task completes before the other commands.
gulp.task('build', ['clean'], function () {
  gulp.start(['scripts', 'styles', 'images']);
  //{base:'./'} makes it so the build in dist uses
  //the proper directories from dev environment
  return gulp.src(['index.html', 'icons/**'], {base:'./'})
  .pipe(gulp.dest('dist'));
});

gulp.task('inject', function () {
  var target = gulp.src('./dist/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['js/all.min.js', 'css/all.min.css'], {read: false});
  return target.pipe(inject(gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./dist'));
});

// As a developer, I should be able to run the gulp command at the command line to run the “build” task.
gulp.task('default', ['build'], function () {
  gulp.start(['inject']);
});

// When running the gulp serve command, the scripts task is run and the current page is reloaded in the browser when a change is made to any JavaScript (*.js) file.
gulp.task('serve', ['build', 'connect', 'watch']);
