const readline = require('readline');
const fs = require('fs');
const bent = require('bent'); // get bent

const rl = readline.createInterface({
  input: fs.createReadStream('guesses.txt')
});

const post = bent('https://api.hisac.computer/', 'POST', 'json', 200);

main = async () => {
  const SWIFT = (await post('command', {'func':'list','directory':'ARCHIVES/','args':['SWIFT']})).content;
  const methodGuesses = ['list','decode','base64decode','ECB','deciper','decrypt', 'decryption', 'open','unlock','B64'];
  const keyGuesses = ['Fe2O3', 'ironoxide', 'this', 'candle'];
  const payloadGuesses = [SWIFT, 'SWIFT'];
  methodGuesses.forEach(async (method) => {
    keyGuesses.forEach(async (key) => {
      payloadGuesses.forEach(async (payload) => {
        // console.log('trying',method,key,payload);
        const response = await post('command', {'func':'freebird','directory':'ARCHIVES/','args':[method,key,payload]});
        console.log(response); // always { error: 'freebird [method] [key] [payload]' }  
      });
    });
  });
}

main();