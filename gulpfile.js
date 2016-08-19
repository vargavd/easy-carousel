

var gulp    = require('gulp');
var eslint  = require('gulp-eslint');
var jasmine = require('gulp-jasmine');

// setting up jQuery
var jsdom     = require("jsdom").jsdom;
var document  = jsdom('<html></html>', {});
global.jQuery = require('jquery')(document.defaultView);


gulp.task('eslint', function () {
    return gulp.src('./js/**/*.js')
        .pipe(eslint({ config: '.eslintrc' }))
        .pipe(eslint.format());
});

gulp.task('test', function () {
    gulp.src('tests.js')
        .pipe(jasmine());
});

gulp.task('watch', function () {
    gulp.watch(['./js/**/*.js'], ['eslint', 'test']);
});

gulp.task('default', function () {
    
});