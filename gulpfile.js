var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    uglifycss = require('gulp-uglifycss'),
    watch = require('gulp-watch');


gulp.task('styles', function(){
  return gulp.src(['./static/features/**/*.css'])
    .pipe(concatCss('sbtp.min.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('./studybee/static/dist'));
});

gulp.task('js', function(){
  return gulp.src('./static/features/**/*.js')
    .pipe(concat('sbtp.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./studybee/static/dist'));

});

gulp.task('watch', function(){
  gulp.watch(['./static/features/**/*.js','./static/features/**/*.css'],['styles','js']);
});

gulp.task('default',['watch','styles','js']);
