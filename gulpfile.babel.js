import process from 'process';
import path from 'path';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import winston from 'winston';

const plugins = gulpLoadPlugins();

const paths = {
  migrations: ['src/**/*.js']
};

// Lint Javascript
gulp.task('lint', () =>
  gulp.src(paths.migrations)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(plugins.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(plugins.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(plugins.eslint.failAfterError())
);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.migrations, '!gulpfile.babel.js'], { base: paths.cwd })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('serve', function() {
  require('./dist/index')();
});

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['babel'], () => {});