'use strict';

var cluster = require('cluster');
var spawn = require('child_process').spawn;

var debug_log = require('debug')('zintqr:log');
debug_log.log = console.log.bind(console);
var debug_error = require('debug')('zintqr:error');


module.exports.cluster = start_cluster;
module.exports.zint = zint;
module.exports.server = server;

function start_cluster(options, callback)
{
	if (!options)
	{
		options = {};
	}
	else if (typeof options === 'function')
	{
		callback = options;
		options = {};
	}
	
	options.workers = options.workers || process.env.ZINT_WORKERS || require('os').cpus().length;
	options.type = options.type || process.env.ZINT_TYPE || 58;
	options.scale = options.scale || process.env.ZINT_SCALE || 4;
	options.port = options.port || process.env.ZINT_PORT || 5000;
	options.route = options.route || process.env.ZINT_ROUTE || '/qr/:id';
	options.parser = options.parser || function(req)
		{
			return req.param('id', '-');
		};;
	
	
	if (cluster.isMaster) {
		
		debug_log('zint-qr server: ' + require('util').inspect(options, false, null));
		
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
		callback(options);
	}
}


function zint(options, text) {
	if (typeof text === 'undefined') {
		text = '-';
	}

	return spawn('zint', ['-b', options.type, '--directpng', '--scale', options.scale, '--border=1', '-d', text]);
}


function worker(options)
{
	var express = require('express');
	var http = require('http');
	var app = express();
	var server = http.Server(app);
	
	app.get(options.route, function(req, res) {
		var png = zint(options, options.parser(req));
		res.type('png');
		png.stdout.pipe(res);
	});

	server.listen(options.port, function() {
		debug_log('zint-qr [' + cluster.worker.id + '] listening on port ' + options.port);
	});
}


function server(options)
{
	start_cluster(options, worker);
}
