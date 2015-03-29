var gulp = require('gulp'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs');
  //includeSources = require('gulp-include-source');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: ['./www/scripts/**/*.js']
};

var env = process.env.NODE_ENV || 'development';

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/assets/css/'))
    // .pipe(minifyCss({
    //   keepSpecialComments: 0
    // }))
    // .pipe(rename({ extname: '.min.css' }))
    // .pipe(gulp.dest('./www/assets/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest('./www/scripts/main.js'));
    //.pipe(gulpif(env === 'production', uglify()))
    //.pipe(gulp.dest(outputDir + 'js'))
    //.pipe(plumber())
    //.pipe(notify({
    //  message: "Scripts tasks have been completed!"
    //}));

  // return gulp.src( paths.template )
  //   .pipe( includeSources() )
  //   .pipe( gulp.dest('./www') );
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', [
  "sass",
  "scripts"
]);
