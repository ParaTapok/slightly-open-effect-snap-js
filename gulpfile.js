"use strict";

var gulp        = require('gulp'),
    compass     = require('gulp-compass'),
    watch       = require('gulp-watch'),
    cssmin      = require('gulp-minify-css'),
    filter      = require('gulp-filter'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat');

var local = 'template/',
    path = {
        build: {
            sass:     local + 'sass',
            styles:   local + 'css',
            js:       local + 'js',
            images:   local + 'img',
            fonts:    local + 'fonts'
        },
        src: {
            styles:   local + 'sass/**/*.scss',
            images:   local + 'img/**/*.*',
            js:       local + 'js-dev/**/*.js'
        },
        watch: {
            styles:   local + 'sass/**/*.scss',
            images:   local + 'img/**/*.*',
            js:       local + 'js-dev/**/*.js'
        }
    };

// CSS
gulp.task('styles:build', function () {
    gulp.src(path.src.styles)
        .pipe(plumber())
        .pipe(compass({
            css:   path.build.styles,
            sass:  path.build.sass,
            image: path.build.images,
            font:  path.build.fonts
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.styles))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task('watchCSS', function(){
    watch([path.watch.styles], function(event, cb) {
        gulp.start('styles:build');
    });
});

// JS
gulp.task('js:min', function () {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(filter(function(file) {
            return !/min.js/.test(file.path)
        }))
        .pipe(concat('init.min.js'))
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.js))
});

gulp.task('watchJS', function(){
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:min');
    });
});

// 
gulp.task('build', ['styles:build', 'js:min']);

gulp.task('default', ['build', 'watchCSS', 'watchJS']);