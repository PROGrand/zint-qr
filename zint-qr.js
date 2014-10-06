'use strict';

var cluster = require('cluster');
var spawn = require('child_process').spawn;

var debug_log = require('debug')('zintqr:log');
debug_log.log = console.log.bind(console);
var debug_error = require('debug')('zintqr:error');


module.exports.cluster = start_cluster;
module.exports.zint = zint;
module.exports.server = server;

function start_cluster(options, callback, parser)
{
	if (typeof options === 'function')
	{
		parser = callback;
		callback = options;
		options = {};
	}
	
	options.workers = options.workers || process.env.ZINT_WORKERS || require('os').cpus().length;
	options.type = options.type || process.env.ZINT_TYPE || 58;
	options.scale = options.scale || process.env.ZINT_SCALE || 4;
	
	if (cluster.isMaster) {
		
		debug_log('*************** MASTER: ' + require('util').inspect(options, false, null));
		
		var fork_worker = function()
		{
			var worker = cluster.fork();
		};

		for (var n = 0; n < options.workers; n++) {
			fork_worker();
		}

		cluster.on('exit', function(worker, code, signal) {
			debug_error('Worker died (ID: ' + worker.id + ', PID: '
					+ worker.process.pid + ')');
			
			fork_worker();
		});
	} else if (cluster.isWorker) {
		callback(options, parser);
	}
}


function zint(options, text) {
	if (typeof text === 'undefined') {
		text = '-';
	}

	return spawn('zint', ['-b', options.type, '--directpng', '--scale', options.scale, '--border=1', '-d', text]);
}


function worker(options, parser)
{
	var express = require('express');
	var http = require('http');
	var app = express();
	var server = http.Server(app);
	
	app.get('/qr/:id', function(req, res) {
		var png = zint(options, parser(req));
		res.type('png');
		png.stdout.pipe(res);
	});

	var port = process.env.ZINT_PORT || 5000;

	server.listen(port, function() {
		debug_log('zint-qr [' + cluster.worker.id + '] listening on port ' + port);
	});
}


function server(parser)
{
	if ('function' !== typeof parser)
	{
		parser = function(req)
		{
			return JSON.stringify(req.param('id', '-'));
		};
	}
	
	start_cluster(worker, parser);
}
