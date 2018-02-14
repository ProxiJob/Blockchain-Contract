
/***** Init Parse and Bdd *****/
var Parse = require('parse/node');
Parse.initialize("proxiID");
Parse.serverURL = 'https://proxijob.herokuapp.com/parse'

/***** Init IPFS API *****/
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
const bitswap = require('ipfs-api/src/bitswap')('/ip4/127.0.0.1/tcp/5001')

/***** Init Object Bdd *****/
var Contract = Parse.Object.extend("Contracts");
var contract = new Contract();


function addContractInIPFS(file, name) {
  console.log("ici");
  ipfs.util.addFromFs(file, {}, (err, result) => {
    if (err) { throw err }
    //console.log(result[0].hash);
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
      console.log(contract[0].get('contract'));
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
    console.log(file.toString('utf8'))
  })
  
}

//id = addContractInIPFS("tmp/toto.txt", "contract");
//console.log(id);
getContractInDB("contract");

/*
*/
