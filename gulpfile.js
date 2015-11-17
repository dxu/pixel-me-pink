const gulp = require('gulp')
  , sourcemaps = require('gulp-sourcemaps')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , plumber = require('gulp-plumber')
  , browserify = require('browserify')
  , util = require('gulp-util')
  , watchify = require('watchify')
  , babelify = require('babelify')
  , shell = require('gulp-shell')
  , concat = require('gulp-concat')


function compile(watch) {
  const bundler =
    watch ? watchify(browserify('./src/scripts/app.js', { debug: true })
      // for es6 module support
      .add(require.resolve('babelify/polyfill'))
      .transform(babelify))
    : browserify('./src/scripts/app.js', { debug: true })
      // for es6 module support
      .add(require.resolve('babelify/polyfill'))
      .transform(babelify)

  function rebundle() {
    bundler.bundle()
      .on('error', util.log.bind(util, 'Browserify Error'))
      .pipe(plumber())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/scripts'))
  }

  rebundle()

  if (watch) {
    bundler.on('update', function() {
      console.log('*** Changes detected! Rebundling...');
      rebundle();
    });
  }
}

gulp.task('templates', function() {
  gulp.src('./templates/**/*.html')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('lib', function() {
  gulp.src('./lib/**/*')
    .pipe(gulp.dest('./dist/lib'))
});

// concat everything together
gulp.task('styles', function() {
  gulp.src('./src/styles/**/*.css')
    .pipe(concat({ path: 'styles.css', stat: { mode: 0666 }}))
    .pipe(gulp.dest('./dist/styles'))
});

gulp.task('dev-js', function() {
  compile(true)
});

gulp.task('prod-js', function() {
  compile(false)
});

gulp.task('test', shell.task([
  'npm test'
]))

gulp.task('default', ['dev-js', 'styles', 'templates', 'lib'])

gulp.task('build', ['prod-js', 'styles', 'templates', 'lib'])
