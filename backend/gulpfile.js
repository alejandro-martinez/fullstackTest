 var gulp = require('gulp'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
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

	fs.exists(main + 'js/bundle.js', function(file) {
		if (file) fs.writeFileSync(main + "js/bundle.js", '');
	});

	return gulp.src([main + 'js/**/*.js',main + 'js/main.js'])
				.pipe(ngAnnotate())
				.pipe(minify())
				.pipe(concat('./temp.js'))
				.pipe(gulp.dest("../frontend/js/"));
});

gulp.task('buildJSBundle',['buildJSAppCode'], function() {
	return gulp.src([
		bower + 'angular/angular.js',
		bower + 'angular-route/angular-route.js',
		main + 'js/temp.js'
	])
	.pipe(concat('./bundle.js'))	
	.pipe(gulp.dest("../frontend/js/"))
	.on('end', function() {
		fs.writeFileSync(main + "js/temp.js", '');
		fs.writeFileSync(main + "css/temp.css", '');
	})
});

gulp.task('default', ['buildCSS', 'buildJSAppCode','buildJSBundle']);