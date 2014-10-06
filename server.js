'use strict';

require('./zint-qr').server();

//var options = {
//	workers: 2, // total workers (default: cpu cores count).
//	route: '/:id', // express-specific url route (default: '/qr/id:').
//	port: 5000, // port, default (5000).
//	parser: function (req){ return 'id: ' + JSON.stringify(req.param('id', '-')); },
//	type: 58, // barcode type, according to zint documentation (default: 58 - QR).
//	scale: 4 // barcode scale (default:4).
//};

//require('./zint-qr').server(options);


