var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', function() {
    // do nothing...
});

// browser-sync css auto injection
// html, js watching and livereload
gulp.task('serve', function () {
    browserSync({
        server : {
            baseDir : '.'
        }
    });

    gulp.watch(['example/*.html', 'src/styles/**/*.css', 'src/scripts/**/*.js'], {cwd: '.'}, reload);

    gulp.watch('./src/less/*.less', ['less']);
});

// less
gulp.task('less', function() {
    gulp.src('./src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./src/styles'));
});

// build