const bent = require('bent');

const post = bent('https://api.hisac.computer/', 'POST', 'json', 200);

const main = async () => {

  const SWIFT = (await post('command', {'func':'list','directory':'ARCHIVES/','args':['SWIFT']})).content;
  console.log(SWIFT); // looks like base64 encoded to me
  const ciphertext = Buffer.from(SWIFT, 'base64').toString('hex');

  const crypto = require('crypto'),
      algorithm = 'aes-128-ecb'; // ECB hint from ls. HISAC only specifies mode not algo though!

  const decrypt = (text,password) => {

    var decipher = crypto.createDecipheriv(algorithm,password,null); // ECB has no iv so set to null
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
  console.log(ciphertext.length); // should be multiple of 16x2 (x2 because hex so two chars per byte)
  
  //console.log(decrypt(ciphertext,'Fe2O3')); // key should also be 16 bytes - generates error if we do this

  console.log(decrypt(ciphertext,'Fe2O3Fe2O3Fe2O3F')); // pad by repetition, still generates error?
  // other paddings to try on my to-do list: spaces, also PKCS#7

}

main();