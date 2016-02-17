var child_process = require('child_process');
var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');

var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-develop-server');


function run(command, options) {
    options = _.extend({ stdio: 'inherit' }, options);

    return new Promise((resolve, reject) => {
        var child = child_process.spawn('sh', ['-c', command], options);
        child.on('error', reject);
        child.on('close', code => {
            if (code !== 0) {
                reject('Process exited with code ' + code);
            } else {
                resolve();
            }
        });
    });
}


const src = 'src/**/*.js';

// Per-file incremental build
function doBuild(src) {
    return src
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', function(err) {
            gutil.log(err.message || err);
            if (err.codeFrame)
                console.log(err.codeFrame);
            this.emit('end', err); // eslint-disable-line no-invalid-this
        })
        .pipe(sourcemaps.write('.', { sourceRoot: '/src' }))
        .pipe(gulp.dest('lib'));
}
gulp.task('build', () => doBuild(gulp.src(src)));
gulp.task('dev:build', ['build'], () => {
    gulp.watch(src, e => {
        if (e.type !== 'deleted')
            doBuild(gulp.src(e.path, { base: 'src' }));
    });
});

gulp.task('serve', () => { server.listen({ path: 'lib/index.js' }); });
gulp.task('dev:serve', ['serve'], () =>  {
    gulp.watch('lib/**/*.js', _.debounce(() => { server.restart(); }, 250));
});

gulp.task('default', ['build']);
gulp.task('dev', ['dev:serve', 'dev:build']);
