var gulp = require('gulp'),
    sass = require('gulp-sass')
    notify = require('gulp-notify')
    browsersync = require('browser-sync').create()
    concat = require('gulp-concat')
    moduleImporter = require('sass-module-importer')
    sourcemaps = require('gulp-sourcemaps')
    data = require('gulp-data')
    path = require('path')
    jade = require('gulp-jade');

var config = {
    sassPath: './resources/sass',
    nodeDir: './node_modules'
}

gulp.task('icons', function() {
    return gulp.src([
        config.nodeDir + '/font-awesome/fonts/**.*',
        config.nodeDir + '/bootstrap-sass/assets/fonts/bootstrap/**.*'
    ])
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('js', function(){
    return gulp.src([
        config.nodeDir + '/jquery/dist/jquery.min.js', 
        config.nodeDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./public/js'));   
});

gulp.task('css', function() {
    return gulp.src('./resources/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed', 
        importer: moduleImporter()
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('index', function() {
    return gulp.src('resources/templates/index.jade')
    .pipe(data(function(file) {
        return require('./resources/templates/index.json');
      }))
        .pipe(jade({pretty: true})) // pip to jade plugin
        .pipe(gulp.dest('public')); // tell gulp our output folder
});

gulp.task('page', function() {
    return gulp.src('resources/templates/page.jade')
    .pipe(data(function(file) {
        return require('./resources/templates/page.json');
      }))
        .pipe(jade({pretty: true})) // pip to jade plugin
        .pipe(gulp.dest('public')); // tell gulp our output folder
});

gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch('public/*.html').on('change', browsersync.reload);
    gulp.watch('public/css/**/*.css').on('change', browsersync.reload);
    gulp.watch('public/js/**/*.js').on('change', browsersync.reload);
});

gulp.task('build', ['icons', 'css', 'js','index']);

gulp.task('serve', ['css','watch'],function(){
	browsersync.init({
        server: "./public"
    });
});