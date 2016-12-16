 var gulp = require('gulp'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	transpile = require('gulp-es6-module-transpiler'),
	minify = require('gulp-minify');
	fs = require('fs');

//Paths
var main = "../frontend/";
var bower = main + "bower_components/";

gulp.task('buildCSS', function(cb) {
	return gulp.src([main  + 'css/main.css'])
		.pipe(concat('./bundle.css'))
		.pipe(gulp.dest('../frontend/css/'))
});

gulp.task('buildJSAppCode',['buildCSS'], function() {
	return gulp.src([main + 'js/**/*.js',main + 'js/main.js'])
				.pipe(ngAnnotate())	
				.pipe(transpile())
				.pipe(minify())
				.pipe(concat('./temp.js'))
				.pipe(gulp.dest("../frontend/js/"));
});

gulp.task('buildJSBundle',['buildJSAppCode'], function() {
	return gulp.src([
		bower + 'angular/angular.js',
		bower + 'angular-ui-router/release/angular-ui-router.js',
		main + 'js/temp.js'
	])
	.pipe(concat('./bundle.js'))	
	.pipe(gulp.dest("../frontend/js/"))
});

gulp.task('default', ['buildCSS', 'buildJSAppCode','buildJSBundle']);