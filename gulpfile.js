var env = process.env.NODE_ENV || 'development';

var gulp = require('gulp');
var inject = require('gulp-inject');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var angularFilesort = require('gulp-angular-filesort');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./www/src/**/*.js']
};

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('./www/assets/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  var sources = gulp.src(paths.scripts, {
      read: true
    })
    .pipe(angularFilesort());

  gulp.src('./www/index.html')
    .pipe(inject(sources, {
      relative: true
    }))
    .pipe(gulp.dest('./www'));

});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', [
  "sass",
  "scripts"
]);
