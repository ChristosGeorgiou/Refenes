var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var ngfilesort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-clean-css');
var jshint = require('gulp-jshint');

var paths = {
    sass: ['./scss/**/*.scss'],
    app: ['./www/src/**/*.js']
};

gulp.task('default', ['sass', 'build', 'libs'], function () {

    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.app, ['build']);

});

gulp.task('sass', function () {
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

gulp.task('libs', function () {

    gulp.src("./node_modules/ionic-sdk/release/**/*").pipe(gulp.dest("./www/libs/ionic-sdk"));
    gulp.src("./node_modules/underscore/underscore-min.js").pipe(gulp.dest("./www/libs/underscore"));
    gulp.src("./node_modules/moment/min/moment.min.js").pipe(gulp.dest("./www/libs/moment"));
    gulp.src("./node_modules/pouchdb/dist/*").pipe(gulp.dest("./www/libs/pouchdb"));
    gulp.src("./node_modules/angular-resource/angular-resource.min.js").pipe(gulp.dest("./www/libs/angular-resource"));
    gulp.src("./node_modules/ionic-datepicker/dist/ionic-datepicker.bundle.min.js").pipe(gulp.dest("./www/libs/ionic-datepicker"));
    
});

gulp.task('build', function () {

    return gulp.src(paths.app)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
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
