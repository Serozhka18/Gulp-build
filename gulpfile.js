const gulp          = require('gulp'),
    babel           = require('gulp-babel'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglifyjs'),
    cssnano         = require('gulp-cssnano'),
    rename          = require('gulp-rename'),
    del             = require('del'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    cache           = require('gulp-cache'),
    autoprefixer    = require('gulp-autoprefixer');


gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cached: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', () => {
   return gulp.src([
       'app/libs/jquery/dist/jquery.min.js',
       'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
       'app/libs/owl-carousel/assets/owl.carousel.min.js'
   ])
       .pipe(concat('libs.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});

gulp.task('css-libs',['sass'], () => {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
});

gulp.task('clean', () => {
  return del.sync('dist');
});

gulp.task('clear', () => {
    return cache.clearAll();
});

gulp.task('img', () => {
   return gulp.src('app/img/**/*')
       .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           svgPlugins: [{removeViewBox: false}],
           une: [pngquant()]
       })))
       .pipe(gulp.dest('dist/img'))
});

gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], () => {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js ', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], () =>{
    let buildCss = gulp.src([
        'app/css/style.css',
        'app/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['watch','clean','img','sass','scripts']);