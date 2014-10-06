# QR-code server based on zint 

Simple qr-code renderer server using [zint](https://github.com/zint/zint) and [express](https://github.com/strongloop/express).

Supports multi-core CPUs through [cluster](http://nodejs.org/docs/latest/api/cluster.html).

## Installation



```bash
npm install zint-qr
```


## Basic Usage

Simple server generating QR code for {{string}} on port 5000 with url like http://localhost:5000/qr/{{string}}.

```javascript
require('zint-qr').server();
```

## Customized Usage

```javascript
var options = {
	workers: 2, // total workers (default: cpu cores count).
	pattern: '/qr/:id', // url pattern (express route) (default: '/qr/:id').
	port: 5000, // port, default (5000).
	parser: function (req){ return 'id: ' + req.param('id', '-'); },
	type: 58, // barcode type, according to zint documentation (default: 58 - QR).
	scale: 4 // barcode scale (default:4).
};

require('zint-qr').server(options);
```


#### LICENSE

This software is licensed under the MIT License.

Copyright Vladimir E. Koltunov, 2014.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
