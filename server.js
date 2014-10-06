'use strict';

require('./zint-qr').server(function (req){
	return JSON.stringify({gift: req.param('id', '-')});
});

