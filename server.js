// Start production server:
// env NODE_ENV=production node server [options]

function getConfig(argv) {
	const args = argv.slice(2);
	var index;

	{
		index = args.indexOf('--config');
		if (index !== -1 && args[index+1]) {
			return args[index+1];
		}
	}

	{
		index = args.indexOf('-c');
		if (index !== -1 && args[index+1]) {
			return args[index+1];
		}
	}

	return 'config.production.json';
}

const http = require('http');
const compression = require('compression')
const express = require('express');
const app = express();
const version = require('./version');
const config = require('./'+getConfig(process.argv));
const manifest = require('./build/manifest.json')
const expressStaticGzip = require('express-static-gzip')
const port = config.port;
delete config.port;
const siteIndex = require('./site-index.js')(config, manifest, version);
const lambdaALB = require('node-lambda-alb')

if (typeof Promise.config !== 'undefined') {
	Promise.config({
		cancellation: true,
	});
	Promise.onPossiblyUnhandledRejection(err => { 
		throw err;
	});
}

// Add app
app.use(
	'/dist',
	expressStaticGzip('build', {
		index: false,
		immutable: true,
		maxAge: '365d',
		enableBrotli: true,
		orderPreference: ['br'],
	})
)
app.use(compression());
app.use('/', express.static('public'))

app.get("/*", (req, res)=> {
	res.set('Content-Type','text/html')
	res.send(siteIndex)
});

function handleError(req, res, err) {
	console.log(err);
	
	req.log.error({
		req: req,
		res: res,
		route: route,
		err: err
	}, 'uncaught exception');

	if (!res.headersSent) {
		req.log.error('sending error response from uncaught exception');
		res.send(err);
	}
}

// If running from AWS lambda environment
if (process.env.IS_LAMBDA == 'true') {
	exports.handler = lambdaALB.handler(app)
} else {
	const httpServer = http.createServer(app);

	httpServer.listen(port, function() {
		console.log('Listening on port %d', httpServer.address().port);
	});

	httpServer.on('uncaughtException', handleError);
}

// Catch any exceptions swallowed by Promises
process.on('unhandledRejection', function(err, promise) {
	console.error("UNHANDLED REJECTION", err.stack);
});

process.on('uncaughtException', function(err) {
	console.error("UNCAUGHT EXCEPTION", err.stack);
});