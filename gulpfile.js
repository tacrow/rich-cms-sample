'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	runSequence = require('run-sequence');

var src = {
	scss:     'resources/assets/sass/**/*.scss',
	css:      'public/assets/css/*.css',
	dest_css: 'public/assets/css/',
	js:       'public/assets/js/**/*.js',
	target_js:'public/assets/js/bundle/*.js',
	dest_js:  'public/assets/js/bundle/',
}

gulp.task('clean', function(cb) {
	return del([src.css, src.target_js], cb);
});

// scss task
gulp.task('sass', function() {
	return $.rubySass(src.scss, { noCache: true, style: 'expanded' })
	.pipe($.plumber())
	.pipe($.autoprefixer())
	.pipe(gulp.dest(src.dest_css));
});

// js task
gulp.task('concat', function() {
	return gulp.src([
		'public/assets/js/namespace.js',
		'public/assets/js/utility/utility.js',
		'public/assets/js/page/top.js',
		'public/assets/js/page/editor.js',
		'public/assets/js/main.js',
	])
	.pipe($.plumber())
	.pipe($.concat('bundle.js'))
	.pipe(gulp.dest(src.dest_js));
});

// watch
gulp.task('watch', function() {
	gulp.watch(src.scss, ['sass']);
	gulp.watch(src.js, ['concat']);
});

// default
gulp.task('default', ['watch']);
