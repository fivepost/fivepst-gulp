// Пути к папкам и файлам проекта
const project_folder = 'build',
	source_folder = "#src";

const path = {
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/images/',
		fonts: project_folder + '/fonts/'
	},
	app: {
		html: [source_folder + '/*.html', '!' + source_folder + '/**/_*.html'],
		css: source_folder + '/scss/styles.scss',
		js: source_folder + '/js/main.js',
		img: source_folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
		fonts: source_folder + '/fonts/*.ttf'
	},
	watch: {
		html: source_folder + '/**/*.html',
		css: source_folder + '/scss/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/images/**/*.{jpg,png,svg,gif,ico,webp}'
	},
	clean: './' + project_folder + '/'
}


const { src, dest, series, parallel } = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include')



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


const watch = parallel(browserSync)

exports.watch = watch
exports.default = watch

