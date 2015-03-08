
var Metalsmith;

fs = require('fs');
path = require('path');
cheerio = require('cheerio');

Metalsmith = require('metalsmith');
Handlebars = require('handlebars');

markdown = require('metalsmith-markdown');
permalinks = require('metalsmith-permalinks');
templates = require('metalsmith-templates');
debug = require('metalsmith-debug');
responsiveImages = require('metalsmith-responsive-images');
watch = require('metalsmith-watch');
serve = require('metalsmith-serve');
sass = require('metalsmith-sass');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/src/templates/partials/header.hbs').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/src/templates/partials/footer.hbs').toString());

Metalsmith(__dirname)
	.use(serve({
		port: 8000
	}))
	.use(watch({
		livereload: true
	}))
	// .use(debug())
	// .use(markdown())
	// .use(ri())
	.use(templates({
		engine: 'handlebars',
		directory: __dirname + '/src/templates'
	}))
	// .use(permalinks())
  .use(responsiveImages({
		sizes: [{
			name: 'tiny',
			width: 300
		},{
			name: 'small',
			width: 600
		},{
			name: 'medium',
			width: 800
		},{
			name: 'large',
			width: 1000
		}]
	}))
	// .use(sass({
	// 	outputStyle: "expanded"
	// }))
  .build(function(err){
    if (err) {
			throw err;
    }
  });

function mdri(settings) {
	return function plugin(files, metalsmith, done) {

		setImmediate(done);

    Object.keys(files).forEach(function(file){

			var data, dir, output, input, regex;

      debug('checking file: %s', file);

			if (!isMd(file)) return;

      data = files[file];

      debug('converting file: %s', file);

			input = data.contents.toString();

			regex = new RegExp('\\!\\[([^\\]]*)\\]\\(([^\\)]+)\\)', 'g');

			output = input.replace(regex, function(match, alt, src) {
					return '';
			});

			data.contents = new Buffer(output);
		});
	}
}

function isMd(file){
  return /\.md|\.markdown/.test(path.extname(file));
}

function isHtml(file){
  return /\.html|\.htm/.test(path.extname(file));
}


function ri(settings) {
	return function plugin(files, metalsmith, done) {

		setImmediate(done);

		Object.keys(files).forEach(function(file){

			var data;

			if (!isHtml(file)) {
				return;
			}

			data = files[file];

			input = data.contents.toString();

			$ = cheerio.load(input);

			$('img').each(function(){
				var $img = $(this);

				// $img.replaceWith();

			});

			data.contents = new Buffer($.html());

		});

	}
}
