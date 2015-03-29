var gulp = require('gulp'),
	inject = require('gulp-inject');
gutil = require('gulp-util'),
	bower = require('bower'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	sh = require('shelljs'),
	angularFilesort = require('gulp-angular-filesort');

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
	var sources = gulp.src(paths.scripts, {
			read: true
		})
		.pipe(angularFilesort());

	gulp.src('./www/index.html')
		.pipe(inject(sources,{
			relative: true
		}))
		.pipe(gulp.dest('./www'));

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
