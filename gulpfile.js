var gulp = require('gulp');
var fs = require('fs');

var sass = require('gulp-sass');
var markdown = require('gulp-markdown');
var header = require('gulp-header');
var browserSync = require('browser-sync');


//
// css
gulp.task('sass', function(){
    gulp.src('./src/styles/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('./preview/css'));
});

//
// markdown
gulp.task('md', function(){
    return gulp.src('./src/*.md')
        .pipe(markdown())
        .pipe(header('<link rel="stylesheet" href="css/styles.css"/>\n'))
        .pipe(header('<div placeholder></div>\n'))
        .pipe(gulp.dest('preview'))
        .pipe(browserSync.reload({stream:true}))
        ;
});

//
// sync
gulp.task('sync', function(){
    browserSync({
        server: {
            baseDir: "preview"
        },
        files: "./preview/**",
        startPath: "/index.html",
        port: 7777,
        online: false,
        logLevel: "debug",
        snippetOptions: {
            // place socket connector into placeholder
            rule: {
                match: /<div placeholder><\/div>/i,
                fn: function (snippet, match) {
                    return snippet;
                }
            }
        }
    });
});

//
// sync reload
gulp.task('bs-reload', function(){
    browserSync.reload();
});

//
// use watcher as default task
gulp.task('default', ['md', 'sync'], function(){
    gulp.watch('./src/*.md', ['md']);
    gulp.watch('./src/styles/*.scss', ['sass']);
    gulp.watch('./preview/css/*.css', ['bs-reload']);
    gulp.watch('./preview/*.html', ['bs-reload']);
});