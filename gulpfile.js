var child_process = require('child_process');
var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-develop-server');

var through2 = require('through2');
var docco = require('gulp-docco');


const src = 'src/**/*.js';

var notifyServer = _.noop;

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
        .pipe(gulp.dest('lib'))
        .on('end', notifyServer);
}
gulp.task('build', () => {
    child_process.execSync('rm -rf lib');
    return doBuild(gulp.src(src));
});
gulp.task('dev:build', ['build'], () => {
    gulp.watch(src, e => {
        if (e.type !== 'deleted')
            doBuild(gulp.src(e.path, { base: 'src' }));
    });
});

gulp.task('serve', () => { server.listen({ path: 'lib/index.js' }); });
gulp.task('dev:serve', ['serve'], () => {
    notifyServer = _.debounce(() => { server.restart(); }, 250);
});

const docsSrc = 'src/docs/**/*.doc.js';

gulp.task('docs', () => {
    return gulp.src(docsSrc)
        .pipe(through2.obj((file, encoding, callback) => {
            var contents = file.contents.toString(encoding);

            var path = file.path.replace('src/', 'lib/');
            child_process.execFile('node', [path, '--json'], {
                maxBuffer: '1024 * 1024',
            }, function(err, stdout) {
                if (err) {
                    callback(err);
                    return;
                }
                var output = JSON.parse(stdout);
                _.forEach(output, function(out, title) {
                    out = '```\n' + out + '\n```';
                    out = out.replace(/^/mg, '// ');
                    contents = contents.replace(
                        new RegExp('^\\/\\*\\s*!request\\s+' + title + '\\s*\\*\\/$', 'm'),
                        out
                    );
                });
                file.contents = new Buffer(contents, encoding);
                callback(null, file);
            });
        }))
        .pipe(docco())
        .pipe(gulp.dest('lib/docs'));
});

gulp.task('default', ['build']);
gulp.task('dev', cb => { runSequence('dev:build', 'dev:serve', cb); });
