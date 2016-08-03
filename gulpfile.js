var baseDir           = 'src/',
    destDir           = 'build/';

var gulp              = require('gulp'),
    plumber           = require('gulp-plumber'),
    rename            = require('gulp-rename'),
    // postcss           = require('gulp-postcss'),
    // autoprefixer      = require('autoprefixer'),
    autoprefixer      = require('gulp-autoprefixer'),
    concat            = require('gulp-concat'),
    jshint            = require('gulp-jshint'),
    csscomb           = require('gulp-csscomb'),
    uglify            = require('gulp-uglify'),
    imagemin          = require('gulp-imagemin'),
    cache             = require('gulp-cache'),
    sourcemaps        = require('gulp-sourcemaps'),
    minifycss         = require('gulp-minify-css'),
    sass              = require('gulp-sass'),
    rimraf            = require('rimraf'),
    browserSync       = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: destDir
    }
  });

  gulp.watch(destDir + '/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function (cb) {
    rimraf(destDir, cb);
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('copy-html', function () {
    return gulp.src([
        baseDir + '*.html'
        ])
        .pipe(gulp.dest(destDir));
});
gulp.task('copy-images', function () {
    return gulp.src([
        baseDir + 'images/*.*'
        ])
        .pipe(gulp.dest(destDir + 'images'));
});

gulp.task('images', function(){
  gulp.src(baseDir + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(destDir + 'images/'));
});

gulp.task('styles', function(){
  gulp.src([baseDir + 'scss/style.scss'])
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    // .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(csscomb())
    .pipe(gulp.dest(destDir + 'css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destDir + 'css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src(baseDir + 'js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destDir + 'js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destDir + 'js/'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('build', ['copy-html', 'images', 'styles', 'scripts']);

gulp.task('default', ['build', 'browser-sync'], function(){
  gulp.watch(baseDir + "scss/**/*.scss", ['styles']);
  gulp.watch(baseDir + "js/**/*.js", ['scripts']);
  gulp.watch(baseDir + "*.html", ['copy-html']);
  gulp.watch(baseDir + "images/**/*", ['copy-images']);
});