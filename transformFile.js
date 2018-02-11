var base64 = require('file-base64');

function pdfTo64File(filename) {
	base64.encode(filename, function(err, base64String) {
		var fs = require('fs');

		fs.appendFile('b64.txt', base64String, function (err) {
		  if (err) throw err;
		  console.log('Saved!');
		});
	});
}

function fileContentB64ToPdf(filename) {
	var fs = require('fs');
	var file = fs.readFileSync('b64.txt', "utf8");
	base64.decode(file, filename, function(err, output) {
		console.log('success');
		fs.unlink('b64.txt', function (err) {
		  if (err) throw err;
		  console.log('File deleted!');
		});
	});
}

// fileContentB64ToPdf('new.pdf');

// pdfTo64File('mail.pdf');
