var gulp = require('gulp'),
    del = require('del'),
    less = require('gulp-less'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    contentIncluder = require('gulp-content-includer'),
    browserSync = require('browser-sync').create();

// 源文件
var _src = {
    js:         'src/js/*.js',
    less:       'src/less/*.less',
    img:        'src/img/**/*',
    html:       'src/html/**/*',
    media:      'src/media/**/*.*',
};

// 构建目录
var _dist = {
    rootPath:   'dist',
    jsPath:     'dist/js/',
    cssPath:    'dist/css/',
    imgPath:    'dist/img/',
    htmlPath:   'dist/html/',
    mediaPath:  'dist/media/',
}

// less
gulp.task('less', function() {
    return gulp.src(_src.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
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
    return gulp.src(_src.img)
        .pipe(gulp.dest(_dist.imgPath))
})

// js
gulp.task('scripts', function() {
    return gulp.src(_src.js)
        .pipe(gulp.dest(_dist.jsPath))

    .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(_dist.jsPath))
})

// 处理 html
gulp.task('html', function() {
    gulp.src(_src.html)
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
            // 格式：<!--include "url"-->
        }))
        .pipe(gulp.dest(_dist.htmlPath));
});

// 其它文件
gulp.task('media', function() {
    gulp.src(_src.media)
        .pipe(gulp.dest(_dist.mediaPath));
});


// 清除构建文件
gulp.task('clean', function() {
    del(_dist.rootPath);
});


gulp.task('default', ['clean'], function() {
    gulp.start(['less', 'images', 'scripts', 'html', 'media', 'browser-sync']);
});

// 同步刷新
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: _dist.rootPath,
            directory: true //显示目录文件列表
        }
    });
    gulp.watch(_src.js, ['scripts']);
    gulp.watch(_src.less, ['less']);
    gulp.watch(_src.img, ['images']);
    gulp.watch(_src.html, ['html']);
    gulp.watch(_src.media, ['media']);
    gulp.watch(_dist.rootPath + '/**/*').on('change', browserSync.reload);
})