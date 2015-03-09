var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var minifyCSS = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;

gulp.task('default', function () {
    // do nothing...
});

// browser-sync css auto injection
// html, js watching and livereload
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: '.'
        }
    });

    gulp.watch(['example/*.html', 'src/styles/**/*.css', 'src/scripts/**/*.js'], {cwd: '.'}, reload);

    gulp.watch('./src/less/*.less', ['less']);
});

// less
gulp.task('less', function () {
    gulp.src('./src/less/wx-scene.less')
        .pipe(less())
        .pipe(gulp.dest('./src/styles'));
});

// build
gulp.task('build', function () {
    // css min
    gulp.src('./src/less/wx-scene.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/styles/'));

    // image min
    gulp.src('./src/images/*.png')
        .pipe(imageMin({
            progressive : true,
            optimizationLevel : 3
        }))
        .pipe(gulp.dest('./dist/images'))

    // js min
    gulp.src('./src/scripts/wx-scene.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'))
});