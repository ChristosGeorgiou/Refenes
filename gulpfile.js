var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var ngfilesort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-clean-css');

var paths = {
    sass: ['./scss/**/*.scss'],
    app: ['./www/src/**/*.js']
};

gulp.task('default', [
    "sass",
    "build"
]);

gulp.task('sass', function(done) {
    return gulp.src(paths.sass, {
            read: true,
        })
        .pipe(sass().on('error', sass.logError))
        .pipe(minify())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest("./www/assets/css"));
});

gulp.task('build', function() {

    return gulp.src(paths.app)
        .pipe(ngfilesort())
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js", {
            newLine: ';'
        }))
        .pipe(ngAnnotate({
            add: true
        }))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./www/assets/js"));

});

gulp.task('watch', ['sass', 'build'], function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.app, ['build']);
});
