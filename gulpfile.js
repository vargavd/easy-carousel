

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('eslint', function () {
    return gulp.src('./js/**/*.js')
        .pipe(eslint({ config: '.eslintrc' }))
        .pipe(eslint.format());
});

gulp.task('watch', function () {
    gulp.watch(['./js/**/*.js'], ['eslint']);
});