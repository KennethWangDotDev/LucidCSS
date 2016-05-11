var gulp = require('gulp'),

    /* Appending header */
    header  = require('gulp-header'),
    package = require('./package.json'),

    /* CSS */
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps  = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    lost = require('lost'),

    /* JavaScript */
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    /* HTML */
    browserSync = require('browser-sync').create(),
    htmlmin = require('gulp-htmlmin'),
    Metalsmith = require('metalsmith'),
    gulpsmith = require('gulpsmith'),
    layout = require('metalsmith-layouts'),
    permalinks = require('metalsmith-permalinks'),
    markdown = require('metalsmith-markdown-remarkable'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign'),

    /* ImageMin */
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegoptim = require('imagemin-jpegoptim'),
    cache = require('gulp-cache'),

    /* Helpers */
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    del = require('del');

    

//Banner header
var banner = [
  '/*!\n' +
  ' * View uncompiled source here:\n' +
  ' * <%= package.repository.url %>\n' +
  ' */',
  '\n\n'
].join('');

var bannerHTML = [
  '<!-- \n' +
  ' - View uncompiled source here:\n' +
  ' - <%= package.repository.url %>\n' +
  ' -->',
  '\n\n'
].join('');

//
gulp.task('css', function () {
  gulp.src('app/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('css-build', function () {
  gulp.src('app/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(cssnano())
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('js',function(){
  gulp.src(['app/assets/js/**/*.js', '!app/assets/js/polyfill/**/*.js'])
    .pipe(plumber())
    .pipe(concat('merged.js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('html', function() {
   gulp.src(['app/html/*.html'])
   .pipe(gulp_front_matter()).on("data", function(file) {
      assign(file, file.frontMatter); 
      delete file.frontMatter;
    })
    .pipe(
      gulpsmith() 
      .metadata({site_name: "Krav Maga Experts"})
      .use(layout({
        engine: "handlebars",
        directory: "app/html/layouts",
        partials: "app/html/partials"
      }))
      .use(permalinks({
        pattern: ':root/:title'
      }))
    )
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(header(bannerHTML, { package : package }))
    .pipe(gulp.dest('dist'));
});

gulp.task('html-home', function() {
  gulp.src("dist/home/index.html")
  .pipe(gulp.dest("dist"));
});

gulp.task('imagemin', function() {
  return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin({
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({quality: "80", floyd: 1, speed: 1}), jpegoptim({progressive: true, max: 90})]
    }))
    .pipe(gulp.dest('dist/assets/images'))
});

gulp.task('clean', function() {
    return del.sync('dist');
});


gulp.task('copy', function() {
   gulp.src(['app/*.*', 'app/.htaccess'])
    .pipe(gulp.dest('dist'));
  gulp.src(['app/assets/fonts/**'])
    .pipe(gulp.dest('dist/assets/fonts'));
});



gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./dist",
        },
        reloadDelay: 300
    });
});

gulp.task('watch', function() {
    gulp.watch("app/assets/scss/**/*.scss", ['css']).on('change', function(evt) {
    	browserSync.reload();
    });

    gulp.watch("app/assets/js/**/*.js", ['js']).on('change', function(evt) {
    	browserSync.reload();
    });

    gulp.watch("app/**/*.+(html)", ['html, html-home']).on('change', function(evt) {
    	browserSync.reload();
    });

    gulp.watch("app/assets/images/**/*.+(png|jpg|jpeg|gif)", ['images']).on('change', function(evt) {
      browserSync.reload();
    });
});

gulp.task('default', function (callback) {
  runSequence('clean', 'copy', 'html',
    ['imagemin', 'css', 'js'],
    'html-home', ['browser-sync', 'watch'],
    callback
  )
});

gulp.task('build', function (callback) {
  runSequence('clean', 'copy', 'html',
    ['imagemin', 'css-build', 'js'],
    'html-home',
    callback
  )
});
