// Пути к папкам и файлам проекта
const project_folder = 'build',
	source_folder = "#src";

const path = {
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/images/',
		fonts: project_folder + '/fonts/',
		resources: project_folder + '/resources/'
	},
	app: {
		html: [source_folder + '/*.html', '!' + source_folder + '/**/_*.html'],
		css: source_folder + '/scss/styles.scss',
		js: source_folder + '/js/main.js',
		img: source_folder + '/images/**/*.{jpg,png,gif,ico,svg,webp}',
		fonts: source_folder + '/fonts/*.ttf',
		resources: source_folder + '/resources/**',
		svgSprites: source_folder + '/images/makesprite/*.svg',
	},
	watch: {
		html: source_folder + '/**/*.html',
		css: source_folder + '/scss/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/images/**/*.{jpg,png,gif, svg,ico,webp}',
		svgSprites: source_folder + '/images/makesprite/*.svg',

	},
	clean: './' + project_folder + '/'
}


const { src, dest, series, parallel } = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass')(require('node-sass')),
	clean_css = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	prefix = require('gulp-rename'),
	strip_comments = require('gulp-strip-css-comments'),
	webpackStream = require('webpack-stream'),
	uglify = require('gulp-uglify-es').default,
	notify = require('gulp-notify'),
	svgSprite = require('gulp-svg-sprite'),
	svgMin = require('gulp-svgmin')





function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + '/'
		},
		port: 666,
		notify: false
	})
}

function html(params) {
	return src(path.app.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css(params) {
	return src(path.app.css)
		.pipe(scss({
			outputStyle: 'expanded',
			includePaths: ['node_modules']
		}))
		.pipe(group_media())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			cascade: true
		}))
		.pipe(strip_comments())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(prefix({
			extname: '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.app.js)
		.pipe(webpackStream({
			mode: 'development',
			output: {
				filename: 'main.js',
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}]
			},
		}))
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end'); // Don't stop the rest of the task
		})
		.pipe(uglify().on("error", notify.onError()))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images(params) {
	return src(path.app.img)
		.pipe(webp({
			quality: 80
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.app.img))
		.pipe(imgmin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 3,
			svgoPlugins: [
				{
					removeViewBox: false
				}
			]
		}))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function svgSprites() {
	return src(path.app.svgSprites)
		.pipe(svgMin())
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg" //sprite file name
				}
			},
		}))
		.pipe(dest(path.build.img));
}

function resources(params) {
	return src(path.app.resources)
		.pipe(dest(path.build.resources))
}

function clean(params) {
	return del(path.clean)
}




const watch = series(clean, resources, svgSprites, js, html, css, browserSync)

exports.watch = watch
exports.default = watch


