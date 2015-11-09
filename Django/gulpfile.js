var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

gulp.task('styles', function(){

});

gulp.task('js', function(){

  return gulp.src('./features/**/*.js')
    .pipe(concat('sbtp.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

});

gulp.task('watch', function(){
  gulp.watch(['./features/**/*.js','./features/**/*.css'],['styles','js']);
});

gulp.task('default',['watch']);
