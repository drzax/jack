
var Metalsmith;

fs = require('fs');
path = require('path');

Metalsmith = require('metalsmith');
Handlebars = require('handlebars');

markdown = require('metalsmith-markdown');
permalinks = require('metalsmith-permalinks');
templates = require('metalsmith-templates');
debug = require('metalsmith-debug');
responsiveImages = require('metalsmith-responsive-images');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/src/templates/partials/header.hbs').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/src/templates/partials/footer.hbs').toString());

Metalsmith(__dirname)
	.use(debug())
	.use(markdown())
	.use(templates({
		engine: 'handlebars',
		directory: __dirname + '/src/templates'
	}))
	.use(permalinks())
  .use(responsiveImages({
		sizes: [{
			name: 'small',
			width: 300
		},{
			name: 'medium',
			width: 600
		},{
			name: 'large',
			width: 1000
		}]
	}))
  .build(function(err){
    if (err) {
      throw err;
    }
  });
