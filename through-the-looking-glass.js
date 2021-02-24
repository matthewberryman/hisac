const fs = require('fs');
const bent = require('bent');
const { mainModule } = require('process');

const post = bent('https://api.hisac.computer/', 'POST', 'json', 200);

main = async () => {
  const response = await post('command', {'func':'open-portal','directory':'/','args':['jabberwocky']});
  //console.log(response);
  const b64string = response.error; // not quite an error ;)
  fs.writeFile('audiofile.mp3', b64string, 'base64', (dat, err) => {if (err) console.log(err)}); // saving it and running `file audiofile.mp3` confirms it is an mp3 file
  // Note you need to reverse it to listen
}

main();