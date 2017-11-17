'use strict';
var changed     = require('gulp-changed');
var responsive  = require('gulp-responsive');
var rename      = require('gulp-rename');

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
const $ = gulpLoadPlugins();

// Delete the _site directory.
gulp.task('cleanup-build', () => {
  return gulp.src('_site', {read: false})
      .pipe($.clean());
});

// Minify the HTML.
gulp.task('minify-html', () => {
  return gulp.src('_site/**/*.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('_site'));
});

// Optimize images.
gulp.task('minify-images', () => {
  gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('_site/images'));
});

// LazyLoad images.
gulp.task('images:lazyload', () => {
  gulp.src('images/lazyload/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)', '!/images/lazyload/**/*.{gif,svg}')
  .pipe(changed('_site/images'))
  .pipe(responsive({
    // resize all images
    '*.*': [{
      width: 20,
      rename: { suffix: '-lq' },
    }, {
      // copy original image
      width: '100%',
      rename: { suffix: '' },
    }]
  }, {
    // global configuration for all images
    errorOnEnlargement: false,
    withMetadata: false,
    errorOnUnusedConfig: false
  }))
  .pipe(gulp.dest('_site/images'))
});

// Concatenate, transpiles ES2015 code to ES5 and minify JavaScript.
gulp.task('scripts', () => {
  gulp.src([
    // Note: You need to explicitly list your scripts here in the right order
    //       to be correctly concatenated
    './_scripts/main.js'
  ])
    .pipe($.concat('main.min.js'))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe(gulp.dest('scripts'));
});

// Minify and add prefix to css.
gulp.task('css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('css/main.css')
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssnano())
    .pipe(gulp.dest('_site/css'));
});

// Watch change in files.
gulp.task('serve', ['jekyll-build'], () => {
  browserSync.init({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: '_site',
    port: 3000
  });

  // Warch html changes.
  gulp.watch([
    'css/**/*.css',
    'scripts/**/*.js',
    '_includes/**/*.html',
    '_layouts/**/*.html',
    '_posts/**/*.md',
    'index.html'
  ], ['jekyll-build', browserSync.reload]);

  // Watch JavaScript changes.
  gulp.watch('_scripts/**/*.js', ['scripts']);
});

gulp.task('generate-service-worker', (callback) => {
  var path = require('path');
  var rootDir = '_site';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,json}'],
    stripPrefix: rootDir,
    // replacePrefix: '/wjbeckett'
  }, callback);
});

gulp.task('jekyll-build', ['scripts', 'css'], $.shell.task(['jekyll build']));

gulp.task('jekyll-build-for-deploy', $.shell.task(['jekyll build']));

// Default task.
gulp.task('build', () =>
  runSequence(
    'cleanup-build',
    'scripts',
    'jekyll-build-for-deploy',
    'minify-html',
    'css',
    'generate-service-worker',
    'minify-images',
    'images:lazyload'
  )
);

// Depoly website to gh-pages.
gulp.task('gh-pages', () => {
  return gulp.src('./_site/**/*')
    .pipe($.ghPages());
});

gulp.task('deploy', () => {
  runSequence(
    'fix-config',
    'cleanup-build',
    'scripts',
    'jekyll-build-for-deploy',
    'minify-html',
    'css',
    'generate-service-worker',
    'minify-images',
    'gh-pages',
    'revert-config'
  )
});

