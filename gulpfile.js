var gulp = require('gulp');

var sass = require('gulp-sass');
var markdown = require('gulp-markdown');
var wrapper = require('gulp-wrapper');
var browserSync = require('browser-sync');
var concat = require('gulp-concat-css');


//
// css
gulp.task('sass', function(){
    gulp.src('./src/styles/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/styles'));
});

gulp.task('css', ['sass'], function(){
    gulp.src('./src/styles/*.css')
        // warning! abc-style concat
        // Normalize, SKeleton, STyles
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./preview/css'));
});

//
// markdown
gulp.task('md', function(){

    return gulp.src('./src/*.md')
        .pipe(markdown())
        .pipe(wrapper({
            header : 
                '<!doctype html>' + 
                '<html>' + 
                '<head>' + 
                '<meta charset="utf-8">' +
                '<meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes">' + 
                '<link rel="stylesheet" href="css/styles.css"/>' +
                '</head>' + 
                '<body><div class="container">'
                ,
            footer : 
                '</div>' + 
                '<div placeholder></div>' + 
                '</body></html>'
        }))
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
// publish html
gulp.task('publish', ['css', 'md']);

//
// use watcher as default task
gulp.task('default', ['css', 'md', 'sync'], function(){
    gulp.watch('./src/*.md', ['md']);
    gulp.watch('./src/styles/*.css', ['css']);
    gulp.watch('./src/styles/*.scss', ['css']);
    gulp.watch('./preview/css/*.css', ['bs-reload']);
    gulp.watch('./preview/*.html', ['bs-reload']);
});