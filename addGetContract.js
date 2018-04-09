
/***** Init Parse and Bdd *****/
var Parse = require('parse/node');
Parse.initialize("proxiID");
Parse.serverURL = 'https://proxijob.herokuapp.com/parse'

/***** Init IPFS API *****/
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
//var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
const bitswap = require('ipfs-api/src/bitswap')('/ip4/127.0.0.1/tcp/5001')

/***** Init Object Bdd *****/
var Contract = Parse.Object.extend("Contracts");
var contract = new Contract();
var base64 = require('file-base64');

function pdfTo64File(filename) {
	base64.encode(filename, function(err, base64String) {
		var fs = require('fs');

		fs.appendFile('b64.txt', base64String, function (err) {
      id = addContractInIPFS("b64.txt", "contractmail");
		  if (err) throw err;
      console.log('Saved!');
      console.log(id);
		});
	});
}

function fileContentB64ToPdf(filename, content) {
	var fs = require('fs');
	base64.decode(content, filename, function(err, output) {
		console.log('success');
	});
}

function addContractInIPFS(file, name) {
  ipfs.util.addFromFs(file, {}, (err, result) => {
    if (err) { throw err }
    console.log(result[0].hash);
    addContractInDB(result[0].hash, name);
  });
}

function addContractInDB(hash, name) {
  contract.set("contract", hash);
  contract.set("name", name);
  contract.save(null, {
    success: function(obj) {
      console.log("New contract added : " + obj.id);
    },
    error: function(obj, error) {
      console.log("addInDB : error");
    }
  });
}

function getContractInDB(name) {
  var query = new Parse.Query(Contract);
  query.equalTo("name", name);
  query.find({
    success: function(contract) {
      getContractInIPFS(contract[0].get('contract'));
      },
    error: function(object, error) {
      console.log("getHash : error");
    }
  });
}

function getContractInIPFS(hash) {
  ipfs.files.cat('/ipfs/' + hash, function (err, file) {
    if (err) {
      throw err
    }
    fileContentB64ToPdf("new.pdf", file.toString('utf8'));
  })  
}

//pdfTo64File("tmp/mail.pdf");

getContractInIPFS("QmdFNYXxcFTSfqPyjLVRRPeR1q8zsHhqfiYcXJzYpzhxNr");
