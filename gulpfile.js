var gulp = require('gulp'),
    del = require('del'),
    less = require('gulp-less'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    contentIncluder = require('gulp-content-includer'),
    browserSync = require('browser-sync').create();

// 源文件目录
var _src = {
    js:         'src/js/',
    less:       'src/less/',
    img:        'src/img/',
    html:       'src/html/',
};

// 构建目录
var _dist = {
    rootPath:   'dist/',
    jsPath:     'dist/js/',
    cssPath:    'dist/css/',
    imgPath:    'dist/img/',
    htmlPath:   'dist/html/',
};

// less
gulp.task('less', function() {
    return gulp.src(_src.less + 'style-\*\.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 5 version'],
            cascade: false
        }))
        .pipe(gulp.dest(_dist.cssPath))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest(_dist.cssPath))
});

// images
gulp.task('images', function() {
    return gulp.src(_src.img + '**/*')
        .pipe(gulp.dest(_dist.imgPath))
});

// js
gulp.task('scripts', function() {
    return gulp.src(_src.js + '*.js')
        .pipe(gulp.dest(_dist.jsPath))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(_dist.jsPath))
});

// 处理 html
gulp.task('html', function() {
    gulp.src(_src.html + '**/*.html')
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
            // 格式：<!--include "url"-->
        }))
        .pipe(gulp.dest(_dist.htmlPath));
});

// 清除构建文件
gulp.task('clean', function() {
    del(_dist.rootPath);
});


gulp.task('default', function() {
    gulp.start(['less', 'images', 'scripts', 'html', 'browser-sync']);
});

// 同步刷新
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: _dist.rootPath,
            directory: true
        }
    });
    gulp.watch(_src.js + '/**/*', ['scripts']);
    gulp.watch(_src.less + '/**/*', ['less']);
    gulp.watch(_src.img + '/**/*', ['images']);
    gulp.watch(_src.html + '/**/*', ['html']);
    gulp.watch(_dist.rootPath + '/**/*').on('change', browserSync.reload);
});