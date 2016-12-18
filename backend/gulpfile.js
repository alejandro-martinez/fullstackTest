 var gulp = require('gulp'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	minify = require('gulp-minify');
	cleanCSS = require('gulp-clean-css');
	fs = require('fs');

//Paths
var main = "../frontend/";
var bower = main + "bower_components/";

gulp.task('buildCSS', function(cb) {
	return gulp.src(main  + 'css/main.css')
		.pipe(cleanCSS())
		.pipe(concat('./bundle.css'))
		.pipe(gulp.dest('../frontend/css/'));		
});

gulp.task('concatJS',['buildCSS'], function() {
	
	var tempFiles = ['temp','bundle','bundle-min'];
	tempFiles.forEach(function(file) {
		var filePath = main + "js/" + file + ".js";
		fs.exists(filePath, function(exists) {
			fs.writeFileSync(filePath, '');
		});
	});

	return gulp.src([main + 'js/**/*.js',main + 'js/main.js'])
				.pipe(ngAnnotate())
				.pipe(concat('./temp.js'))
				.pipe(gulp.dest("../frontend/js/"));
});

gulp.task('buildJSBundle',['concatJS'], function() {
	return gulp.src([
		bower + 'angular/angular.js',
		bower + 'angular-route/angular-route.js',
		main + 'js/temp.js'
	])
	.pipe(concat('./bundle.js'))	
	.pipe(minify())
	.pipe(gulp.dest("../frontend/js/"))
	.on('end', function() {
		fs.writeFileSync(main + "js/bundle.js", '');
		fs.writeFileSync(main + "js/temp.js", '');
		fs.writeFileSync(main + "css/temp.css", '');
	})
});

gulp.task('default', ['buildCSS', 'concatJS', 'buildJSBundle']);