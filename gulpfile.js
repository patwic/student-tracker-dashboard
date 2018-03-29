const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
// const sass = require('gulp-sass');
const annotate = require('gulp-ng-annotate');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');

const paths = {
  jsSource: [
    './public/app.js',
    './public/app.config.js',
    './public/controllers/**/*.js',
    './public/services/**/*.js',
    './public/directives/**/*.js',
  ],
  cssSource: ['./public/styles/**/*.css'],
  indexSource: ['./public/index.html'],
  viewsSource: ['./public/views/**/*.html'],
  picturesSource: ['./public/assets/**/*'],
};

gulp.task('css', () =>
  gulp
    .src(paths.css)
    .pipe(plumber())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(concat('bundle.css'))
    .pipe(cssmin())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('js', () =>
  gulp
    .src(paths.jsSource)
    .pipe(plumber())
    .pipe(annotate())
    .pipe(concat('bundle.js'))
    // .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('views', () => {
  gulp
    .src(paths.viewsSource)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist/views'));
});

gulp.task('index', () => {
  gulp
    .src(paths.indexSource)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('pictures', () => {
  gulp.src(paths.picturesSource).pipe(gulp.dest('./dist/assets'));
});

gulp.task('watch', () => {
  gulp.watch(paths.jsSource, ['js']);
  gulp.watch(paths.sassSource, ['css']);
  gulp.watch(paths.indexSource, ['index']);
  gulp.watch(paths.viewsSource, ['views']);
  gulp.watch(paths.picturesSource, ['pictures']);
});

gulp.task('default', ['js', 'jsLibraries', 'css', 'index', 'views', 'pictures', 'watch']);
