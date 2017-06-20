var gulp = require('gulp'),
    del = require('del'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    gulpif = require('gulp-if'),
    tmtsprite = require('gulp-tmtsprite'),
    contentIncluder = require('gulp-content-includer'),
    browserSync = require('browser-sync').create();

// 源文件目录
var _src = {
    js:         'src/js/',
    less:       'src/less/',
    img:        'src/img/',
    slice:      'src/slice/',
    html:       'src/html/',
};

// 构建目录
var _dist = {
    root:       'dist/',
    js:         'dist/js/',
    css:        'dist/css/',
    img:        'dist/img/',
    sprite:     'dist/sprite/',
    html:       'dist/html/',
};


// less
gulp.task('less', function() {
    return gulp.src(_src.less + 'style-\*\.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: true
        }))
        .pipe(tmtsprite({margin: 10}))
        .pipe(gulpif('*.png', gulp.dest('./dist/sprite/'), gulp.dest('./dist/css/')))
});

// images
gulp.task('images', function() {
    return gulp.src(_src.img + '**/*')
        .pipe(gulp.dest(_dist.img))
});

// js
gulp.task('scripts', function() {
    return gulp.src(_src.js + '*.js')
        .pipe(gulp.dest(_dist.js))
});

// 处理 html
gulp.task('html', function() {
    gulp.src(_src.html + '**/*.html')
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest(_dist.html));
});

// 清除构建文件
gulp.task('clean', function() {
    del(_dist.root);
});

gulp.task('default', function() {
    gulp.start(['less', 'images', 'scripts', 'html', 'browser-sync']);
});

// 同步刷新
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: _dist.root,
            directory: true
        }
    });
    gulp.watch(_src.js + '**/*', ['scripts']);
    gulp.watch(_src.less + '**/*', ['less']);
    gulp.watch(_src.img + '**/*', ['images']);
    gulp.watch(_src.html + '**/*', ['html']);
    gulp.watch(_dist.root + '**/*').on('change', browserSync.reload);
});
